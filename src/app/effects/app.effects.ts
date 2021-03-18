import { Injectable } from '@angular/core'
import { Actions, ofType, Effect } from '@ngrx/effects'
import { Observable, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { SET_ERRORS, GET_STATUS_CODE, SET_STATUS_CODE } from '../actions/errors.actions'
import { HttpErrorResponse } from '@angular/common/http'
import * as actionsApp from '../actions/app.actions'
import { AppService } from '../services/app.service'
import { IndexdbService } from '../services/indexedbs.service'


@Injectable()
export class AppEffect {

  constructor(
    private _action: Actions,
    private _appService: AppService,
    private _indexedb: IndexdbService,
  ) {
  }

  @Effect()
  public online$: Observable<Actions> = this._action.pipe(
    ofType(actionsApp.ONLINE),
    mergeMap(() => this._appService.isOnline().pipe(catchError(e => of(e)))),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'offline' }
        return SET_ERRORS({ payload: source })
      } else {
        return actionsApp.SET_ONLINE({ payload: true })
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public getStatusCodes$: Observable<Actions> = this._action.pipe(
    ofType(GET_STATUS_CODE),
    mergeMap(() => this._indexedb.getById('status_code_id')),
    mergeMap((status_code) => {
      if (status_code) {
        return [SET_STATUS_CODE({ payload: status_code.status_code })]
      } else {
        return this._appService.getStatusCode().pipe(
          map((status_code: any) => {
            if (status_code) this._indexedb.create({ id: 'status_code_id', status_code })
            return SET_STATUS_CODE({ payload: status_code })
          }),
          catchError(e => {
            const source = { ...e, source: 'status_code' }
            return [SET_ERRORS({ payload: source })]
          })
        )
      }
    }),
    catchError(err => of(err))
  )
}