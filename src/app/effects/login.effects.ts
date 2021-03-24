import { Injectable } from '@angular/core'
import { Actions, ofType, Effect } from '@ngrx/effects'
import { Observable, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { SET_ERRORS, SET_SUCCESS } from '../actions/errors.actions'
import { HttpErrorResponse } from '@angular/common/http'
import * as actionsLogin from '../actions/login.actions'
import * as actionsApp from '../actions/app.actions'
import { LoginService } from '../services/login.service'
import { Store } from '@ngrx/store'


@Injectable()
export class LoginEffect {

  constructor(
    private _action: Actions,
    private _loginService: LoginService,
    private _store: Store
  ) {
  }

  @Effect()
  public createUser$: Observable<Actions> = this._action.pipe(
    ofType(actionsLogin.CREATE_USER),
    mergeMap(({ payload }) => this._loginService.signup(payload).pipe(catchError(e => of(e)))),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'create_user' }
        return SET_ERRORS({ payload: source })
      } else {
        return actionsLogin.CREATED_USER({ payload: true })
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public signin$: Observable<Actions> = this._action.pipe(
    ofType(actionsLogin.SIGNIN),
    mergeMap(({ payload }) => this._loginService.signin(payload).pipe(catchError(e => of(e)))),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'signin' }
        return SET_ERRORS({ payload: source })
      } else {
        this._store.dispatch(SET_SUCCESS({ payload: 'login' }))
        this._store.dispatch(actionsLogin.SET_USER({ payload }))
        return actionsLogin.LOGGED_USER({ payload: true })
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public fetch$: Observable<Actions> = this._action.pipe(
    ofType(actionsLogin.GET_USER),
    mergeMap(() => this._loginService.fetchUser().pipe(catchError(e => of(e)))),
    map((payload) => actionsLogin.SET_USER({ payload })),
    catchError(err => of(err))
  )

  @Effect()
  public logout$: Observable<Actions> = this._action.pipe(
    ofType(actionsLogin.LOGOUT),
    mergeMap(() => this._loginService.logout().pipe(map(() => {
      this._store.dispatch(actionsApp.RESET_ALL())
      return actionsLogin.RESET()
    }))),
    catchError(err => of(err))
  )
}