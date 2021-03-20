import { createAction, props } from '@ngrx/store'

export enum actionsTypes {
  ONLINE = '[ONLINE]',
  SET_ONLINE = '[SET_ONLINE]',
  RESET_ALL = '[RESET_ALL]',
}

export const ONLINE = createAction(actionsTypes.ONLINE)
export const SET_ONLINE = createAction(actionsTypes.SET_ONLINE, props<{ payload: any }>())
export const RESET_ALL = createAction(actionsTypes.RESET_ALL)

