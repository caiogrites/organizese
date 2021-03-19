import { createReducer, on } from "@ngrx/store"
import * as actions from '../actions/profile.actions'

const INITIAL_STATES = {
  data: {}
}

const profileReducer = createReducer(
  INITIAL_STATES,
  on(actions.SET_PROFILE, (states, { payload }) => ({ ...states, data: payload })),
)

export function reducerProfile(state: any, action: any) {
  return profileReducer(state, action)
}