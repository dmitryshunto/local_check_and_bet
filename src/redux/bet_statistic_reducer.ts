import { my_net_api } from "../API/api";
import { OddTypeType } from "./betReducer";
import { Kinds_of_bet_type } from "./my_net_main_page_reducer";
import { PropertiesType, BaseThunkActionType } from "./redux"

const SET_BET_STATISTIC = 'BET_STATISTIC_REDUCER/SET_BET_STATISTIC'
const SET_INITIAL_STATE = 'BET_STATISTIC_REDUCER/SET_INITIAL_STATE'
const TOGGLE_IS_GETTING_DATA = 'BET_STATISTIC_REDUCER/TOGGLE_IS_GETTING_DATA'

export const actions = {
    set_bet_statistic : (object: typeof innitialObject) => ({type: SET_BET_STATISTIC, object} as const),
    set_initial_state: () => ({type: SET_INITIAL_STATE} as const),
    toggle_is_getting_data : (isGettingData: boolean) => ({type: TOGGLE_IS_GETTING_DATA, isGettingData} as const)
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
    data: null as FullBetStatisticDataType
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

let betStatisticReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    if(action.type === SET_BET_STATISTIC) {
        return {
            ...state,
            ...action.object
        }
    } else if(action.type === TOGGLE_IS_GETTING_DATA) {
        return {
            ...state,
            isGettingData: action.isGettingData
        }
    } else if(action.type === SET_INITIAL_STATE) {
        return innitialObject
    } else return state;
}

export const setBetStatisticTC = (db_name: string, kind_of_bet: Kinds_of_bet_type, type_of_bet: OddTypeType): BaseThunkActionType<ActionsTypes> => async (dispatch: any) => {
    dispatch(actions.toggle_is_getting_data(true))
    let response = await my_net_api.get_full_bet_statistic(db_name, kind_of_bet, type_of_bet)
    dispatch(actions.set_bet_statistic({ data: response.data,
                                 isGettingData: false}))
}


export default betStatisticReducer;