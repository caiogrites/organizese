import { Injectable } from '@angular/core'
import { Actions, ofType, Effect } from '@ngrx/effects'
import { Observable, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { SET_ERRORS, GET_STATUS_CODE, SET_STATUS_CODE } from '../actions/errors.actions'
import { HttpErrorResponse } from '@angular/common/http'
import * as actionsApp from '../actions/app.actions'
import * as actionsProfile from '../actions/profile.actions'
import { AppService } from '../services/app.service'
import { IndexdbService } from '../services/indexedbs.service'
import { ProfileService } from '../services/profile.service'

@Injectable()
export class ProfileEffect {

  constructor(
    private _action: Actions,
    private _profileService: ProfileService
  ) {
  }

  @Effect()
  public updateProfile$: Observable<Actions> = this._action.pipe(
    ofType(actionsProfile.LISTENING_PROFILE),
    mergeMap(({ payload }) => this._profileService.profileUpdate(payload).pipe(catchError(e => of(e)))),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'update_profile' }
        return SET_ERRORS({ payload: source })
      } else {
        return actionsProfile.SET_PROFILE({ payload })
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public getProfile$: Observable<Actions> = this._action.pipe(
    ofType(actionsProfile.GET_PROFILE),
    mergeMap(() => this._profileService.profileGet().pipe(catchError(e => of(e)))),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'get_profile' }
        return SET_ERRORS({ payload: source })
      } else {
        return actionsProfile.SET_PROFILE({ payload })
      }
    }),
    catchError(err => of(err))
  )
}