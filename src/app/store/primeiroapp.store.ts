
import { ActionReducerMap } from '@ngrx/store'
import { reducer } from '../reducers/registers.reducers'
import { reducerDashboard } from '../reducers/dashboard.reducers'
import { reducerErrors } from '../reducers/errors.reducers'
import { reducerApp } from '../reducers/app.reducer'
import { reducerLogin } from '../reducers/login.reducer'

export const PrimeiroAppStore: ActionReducerMap<any> = {
  app: reducerApp,
  login: reducerLogin,
  registers: reducer,
  dashboard: reducerDashboard,
  http_error: reducerErrors
}