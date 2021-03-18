import { createAction, props } from '@ngrx/store'

export enum actionsTypes {
  ONLINE = '[ONLINE]',
  SET_ONLINE = '[SET_ONLINE]',
}

export const ONLINE = createAction(actionsTypes.ONLINE)
export const SET_ONLINE = createAction(actionsTypes.SET_ONLINE, props<{ payload: any }>())