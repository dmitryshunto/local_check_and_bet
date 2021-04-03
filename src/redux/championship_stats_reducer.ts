import { my_net_api } from './../API/api';
import { PropertiesType, BaseThunkActionType } from "./redux"
import { MyNetGameType } from './my_net_main_page_reducer';

const SET_CHAMPIONSHIP_STATS = 'CHAMPIONSHIP_STATS_REDUCER/SET_CHAMPIONSHIP_STATS';
const TOGGLE_IS_GETTING_DATA = 'CHAMPIONSHIP_STATS_REDUCER/TOGGLE_IS_GETTING_DATA'
const SET_INITIAL_STATE = 'CHAMPIONSHIP_STATS_REDUCER/SET_INITIAL_STATE'

export const actions = {
    set_championship_stats: (data: ChampionshipDataType) => ({ type: SET_CHAMPIONSHIP_STATS, data } as const),
    toggle_is_getting_data: (isGettingData: boolean) => ({ type: TOGGLE_IS_GETTING_DATA, isGettingData } as const),
    set_championship_page_initial_state: () => ({ type: SET_INITIAL_STATE } as const),

}

export type TotalsInfoType = { over: number, under: number, total: number }[]

export type TeamStatistic = {
    [key: string]: string | number | TotalsInfoType | BookRatingType
    totals_info: TotalsInfoType
    name_of_team: string
    number_of_games: string
    scored: number
    missed: number
    total: number
    over: number
    under: number
    win1: number
    x: number
    win2: number
    book_rating: BookRatingType
}

type BookRatingType = {
    [key: string]: number
    positive: number
    negative: number
    neutral: number
}

type KindOfBetDataType = {
    [key: string]: Array<TeamStatistic>
    home: Array<TeamStatistic>
    away: Array<TeamStatistic>
}

export type ChampionshipStatsDataType = {
    [key: string]: KindOfBetDataType | undefined
    goals: KindOfBetDataType
    yellow_cards?: KindOfBetDataType
    corners?: KindOfBetDataType
    fouls?: KindOfBetDataType
    shots_on_goal?: KindOfBetDataType
}

export type KindOfBetStatisticItemType = {
    [key: string]: number
    bet_success: number
    count: number
}

type KindOfBetStatisticType = {
    [key: string]: KindOfBetStatisticItemType
    TO: KindOfBetStatisticItemType
    TU: KindOfBetStatisticItemType
    home: KindOfBetStatisticItemType
    away: KindOfBetStatisticItemType
}

export type BetStatisticType = {
    [key: string]: KindOfBetStatisticType | undefined
    goals: KindOfBetStatisticType
    yellow_cards?: KindOfBetStatisticType
    corners?: KindOfBetStatisticType
    fouls?: KindOfBetStatisticType
    shots_on_goal?: KindOfBetStatisticType
}

export type BasicTotals = {
    [key: string]: number | undefined
    goals: number
    yellow_cards?: number
    corners?: number
    fouls?: number
    shots_on_goal?: number
} | null

export type KindsOfBetTotalIntervalType = {
    goals: number[]
    yellow_cards?: number[]
    corners?: number[]
    fouls?: number[]
    shots_on_goal?: number[]
}

export type ChampionshipDataType = {
    championships_stats: ChampionshipStatsDataType
    kinds_of_bet_total_interval: KindsOfBetTotalIntervalType
    bet_statistic: BetStatisticType
    basic_totals: BasicTotals
    games: MyNetGameType[] | []
}

let innitialObject = {
    isGettingData: false,
    data: null as ChampionshipDataType | null
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

let championshipStatsReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    if (action.type === SET_CHAMPIONSHIP_STATS) {
        return {
            ...state,
            data: action.data
        }
    } else if (action.type === TOGGLE_IS_GETTING_DATA) {
        return {
            ...state,
            isGettingData: action.isGettingData
        }
    } else if (action.type === SET_INITIAL_STATE) {
        return innitialObject
    } else return state;
}

export const setChampionshipStatsTC = (name_of_championship: string): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    dispatch(actions.toggle_is_getting_data(true));
    let response = await my_net_api.get_championship_stats(name_of_championship);
    dispatch(actions.set_championship_stats(response.data));
    dispatch(actions.toggle_is_getting_data(false));
}

export default championshipStatsReducer;