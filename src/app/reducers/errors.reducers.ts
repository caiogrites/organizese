import { createReducer, on } from "@ngrx/store"
import * as actions from '../actions/errors.actions'
import * as actionsApp from '../actions/app.actions'

const INITIAL_STATES = {
  errors: [],
  status_code: [],
  success: ''
}

const errorsReducers = createReducer(
  INITIAL_STATES,
  on(actions.SET_ERRORS, (states, { payload }) => ({ ...states, errors: states.errors.concat(payload) })),
  on(actions.SET_STATUS_CODE, (states, { payload }) => ({ ...states, status_code: payload })),
  on(actions.SET_SUCCESS, (states, { payload }) => ({ ...states, success: payload })),
  on(actions.RESET_ERRORS, (states) => ({ ...states, errors: [] })),

  on(actionsApp.RESET_ALL, (states) => ({ ...states, errors: [], status_code: [], success: '' }))
)

export function reducerErrors(state: any, action: any) {
  return errorsReducers(state, action)
}