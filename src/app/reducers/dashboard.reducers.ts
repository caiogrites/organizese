import { createReducer, on } from "@ngrx/store";
import * as actions from '../actions/dashboard.actions'

const INITIAL_STATES = {
  consolidado: {
    total_credit: 0,
    total_debit: 0,
    total_consolidado: 0,
    a_pagar: 0,
    a_receber: 0
  },
  dark_mode: '',
  mode: '',
  evolucao: {},
  evolucao_detail: {},
  evolucao_despesas: {},
  auto_complete: []
}

const dashboardReducers = createReducer(
  INITIAL_STATES,
  on(actions.GET_TOTALS, (states, { payload }) => ({ ...states, consolidado: payload })),
  on(actions.DARK_MODE, (states, { payload }) => ({ ...states, dark_mode: payload })),
  on(actions.SET_EVOLUCAO, (states, { payload }) => ({ ...states, evolucao: payload })),
  on(actions.SET_EVOLUCAO_DETAIL, (states, { payload }) => ({ ...states, evolucao_detail: payload })),
  on(actions.SET_DEV_MODE, (states, { payload }) => ({ ...states, mode: payload.mode })),
  on(actions.SET_EVOLUCAO_DESPESAS, (states, { payload }) => ({ ...states, evolucao_despesas: payload })),
  on(actions.SET_AUTOCOMPLETE, (states, { payload }) => ({ ...states, auto_complete: payload })),
)

export function reducerDashboard(state: any, action: any) {
  return dashboardReducers(state, action)
}