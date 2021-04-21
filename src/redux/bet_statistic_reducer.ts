import { my_net_api } from "../API/api";
import { ResultCodeTypes } from "../API/api_types";
import { OddTypeType } from "./betReducer";
import { PropertiesType, BaseThunkActionType, NewKindOfBet } from "./redux"
import { actions as error_handler_actions, SetErrorMessageAction } from './error_handler_reducer';

const SET_BET_STATISTIC = 'BET_STATISTIC_REDUCER/SET_BET_STATISTIC'
const SET_INITIAL_STATE = 'BET_STATISTIC_REDUCER/SET_INITIAL_STATE'
const TOGGLE_IS_GETTING_DATA = 'BET_STATISTIC_REDUCER/TOGGLE_IS_GETTING_DATA'
const SET_ERROR_MESSAGES = 'BET_STATISTIC_REDUCER/SET_ERROR_MESSAGES'

export const actions = {
    set_bet_statistic : (data: FullBetStatisticDataType) => ({type: SET_BET_STATISTIC, data} as const),
    set_initial_state: () => ({type: SET_INITIAL_STATE} as const),
    toggle_is_getting_data : (isGettingData: boolean) => ({type: TOGGLE_IS_GETTING_DATA, isGettingData} as const),
    set_error_messages: (error_messages: [] | string[]) => ({type: SET_ERROR_MESSAGES, error_messages} as const)
}

export type FullBetStatisticItemType = {
    bet_success: number
    book_win1?: number | null
    book_x?: number | null
    book_win2?: number | null
    expected_result: number
    expected_total: number
    home_team_name: string
    away_team_name: string
    home_team_scored: number
    away_team_scored: number
    value: number
    date_of_match: string
}

export type FullBetStatisticDataType = Array<FullBetStatisticItemType> | null

let innitialObject = {
    isGettingData: true,
    error_messages: [] as string[],
    data: null as FullBetStatisticDataType
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

let betStatisticReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    if(action.type === SET_BET_STATISTIC) {
        return {
            ...state,
            data: action.data
        }
    } else if(action.type === TOGGLE_IS_GETTING_DATA) {
        return {
            ...state,
            isGettingData: action.isGettingData
        }
    } else if(action.type === SET_INITIAL_STATE) {
        return innitialObject
    } else if (action.type === SET_ERROR_MESSAGES) {
        return {
            ...state,
            error_messages: action.error_messages
        }
    } else return state;
}

export const setBetStatisticTC = (db_name: string, kind_of_bet: NewKindOfBet, type_of_bet: OddTypeType): BaseThunkActionType<ActionsTypes | SetErrorMessageAction> => async (dispatch) => {
    dispatch(actions.toggle_is_getting_data(true))
    let response = await my_net_api.get_full_bet_statistic(db_name, kind_of_bet, type_of_bet)
    if(response.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.set_bet_statistic(response.data))
    } else if (response.resultCode === ResultCodeTypes.Error) {
        dispatch(error_handler_actions.set_error(response.error_messages))
    }
    dispatch(actions.toggle_is_getting_data(false))
}


export default betStatisticReducer;