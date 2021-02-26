import { getFullBetStatistic } from "../API/api";
import { PropertiesType, BaseThunkActionType } from "./redux"

const SET_BET_STATISTIC = 'BET_STATISTIC_REDUCER/SET_BET_STATISTIC'
const TOGGLE_IS_GETTING_DATA = 'BET_STATISTIC_REDUCER/TOGGLE_IS_GETTING_DATA'

export const actions = {
    set_bet_statistic : (object: typeof innitialObject) => ({type: SET_BET_STATISTIC, object} as const),
    toggle_is_getting_data : (isGettingData: boolean) => ({type: TOGGLE_IS_GETTING_DATA, isGettingData} as const)
}

export type FullBetStatisticItemType = {
    bet_success: boolean
    book_win1?: number | null
    book_x?: number | null
    book_win2?: number | null
    expected_of_team1: number
    expected_of_team2: number
    expected_result: number
    expected_total: number
    name_of_team1: string
    name_of_team2: string
    team1_scored: number
    team2_scored: number
    total: number
    date_of_match: string
}

export type FullBetStatisticDataType = Array<FullBetStatisticItemType> | null

let innitialObject = {
    isGettingData: false,
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
    } else return state;
}

export const setBetStatisticTC = (name_of_championship: string, kind_of_bet: string, type_of_bet: string): BaseThunkActionType<ActionsTypes> => async (dispatch: any) => {
    dispatch(actions.toggle_is_getting_data(true))
    let response = await getFullBetStatistic(name_of_championship, kind_of_bet, type_of_bet)
    dispatch(actions.set_bet_statistic({ data: response.data,
                                 isGettingData: false}))
}


export default betStatisticReducer;