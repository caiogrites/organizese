import { createReducer, on } from "@ngrx/store"
import * as actions from '../actions/profile.actions'
import * as actionsApp from '../actions/app.actions'

const INITIAL_STATES = {
  data: {}
}

const profileReducer = createReducer(
  INITIAL_STATES,
  on(actions.SET_PROFILE, (states, { payload }) => ({ ...states, data: payload })),

  on(actionsApp.RESET_ALL, (states) => ({ ...states, data: {} }))
)

export function reducerProfile(state: any, action: any) {
  return profileReducer(state, action)
}