import { createReducer, on } from "@ngrx/store"
import * as actions from '../actions/app.actions'

const INITIAL_STATES = {
  online: false
}

const appReducer = createReducer(
  INITIAL_STATES,
  on(actions.SET_ONLINE, (states, { payload }) => ({ ...states, online: payload })),
)

export function reducerApp(state: any, action: any) {
  return appReducer(state, action)
}