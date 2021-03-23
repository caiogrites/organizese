import { createReducer, on } from "@ngrx/store"
import * as actions from '../actions/registers.actions'
import { Register } from "../models/models"
import * as actionsApp from '../actions/app.actions'

const categories: string[] = [
  'Banco',
  'Alimentação',
  'Vestuário',
  'Transporte',
  'Água & Luz',
  'Internet',
  'Pessoal',
  'Trabalho'
].sort()

const INITIAL_STATE = {
  all: [],
  tab: '',
  visible: {},
  consolidado: {},
  msg: '',
  total: 0,
  total_geral: 0,
  categories,
  total_despesas: 0,
  total_receita: 0,
  a_receber: 0,
  a_pagar: 0,
  all_days_period: 1,
  result_search: []
}
const registersReducers = createReducer(
  INITIAL_STATE,
  on(actions.SET_REGISTERS, (states, { payload }) => ({ ...states, all: states.all.concat(payload) })),
  on(actions.GET_REGISTERS, (states, { payload }) => {
    const totals: any = total(payload.data.results)
    return ({
      ...states,
      all: payload.data.results.length > 0 ? updateAll(payload.data.results) : [],
      consolidado: payload.data.consolidado,
      msg: payload.msg,
      total: payload.data.total,
      total_geral: payload.data.total_geral,
      total_despesas: totals.despesa,
      total_receita: totals.receita,
      a_pagar: payload.data.consolidado.a_pagar,
      a_receber: payload.data.consolidado.a_receber,
      all_days_period: payload.data.days <= 0 ? 1 : payload.data.days
    })
  }),
  on(actions.GET_TAB, (states, { payload }) => ({ ...states, tab: payload })),
  on(actions.SET_SHOWTAB, (states, { payload }) => ({ ...states, visible: payload })),
  on(actions.SET_UPDATE, (states, { payload }) => {
    const stateUpdated: any = [...states.all]
    stateUpdated[stateUpdated.findIndex((r: any) => r._id.$oid === payload._id.$oid)] = payload
    return { ...states, all: updateAll(stateUpdated) }
  }),
  on(actions.SET_SEARCH, (states, { payload }) => ({ ...states, result_search: updateAll(payload) })),

  on(actionsApp.RESET_ALL, (states) => ({
    ...states,
    all: updateAll([]),
    tab: '',
    visible: {},
    consolidado: {},
    msg: '',
    total: 0,
    total_despesas: 0,
    categories,
    a_pagar: 0,
    a_receber: 0,
    all_days_period: 1,
    result_search: []
  })),
)

function updateAll(all: any) {
  return all.map((s: Register) => ({ ...s, status: statusTrans(s.status, s.type), cat_icon: returnIcon(s.category) }))
}

function total(lista: any) {
  const total: any = { despesa: 0, receita: 0 }
  lista.forEach((v: any) => {
    if (v.type === 'outcoming') {
      total['despesa'] += v.value
    } else if (v.type === 'incoming') {
      total['receita'] += v.value
    }
  })
  return total
}

function returnIcon(text: string = ''): string {
  switch (cleanText(text)) {
    case 'alimentacao':
      return 'restaurant'
    case 'transporte':
      return 'train'
    case 'banco':
      return 'account_balance'
    case 'trabalho':
      return 'work_outline'
    case 'vestuario':
      return 'checkroom'
    case 'outros':
      return 'drag_indicator'
    case 'pessoal':
      return 'perm_identity'
    case 'internet':
      return 'swap_vert'
    case 'agua_e_luz':
      return 'payment'
    default:
      return 'drag_indicator'
  }
}

function statusTrans(text: string = '', type: string) {
  switch (text) {
    case 'pending':
    case 'pendente a pagar':
    case 'pendente a receber':
      return type === 'incoming' ? 'pendente a receber' : 'pendente a pagar'
    case 'done':
    case 'concluído':
      return 'concluído'
    default:
      return 'pendente'
  }
}

function cleanText(text: string | undefined = ''): string {
  return text.toLowerCase().replace(' ', '_').replace('&', 'e').replace('á', 'a').replace('ã', 'a')
    .replace('ç', 'c').replace('õ', 'o')
}

export function reducer(state: any, action: any) {
  return registersReducers(state, action)
}