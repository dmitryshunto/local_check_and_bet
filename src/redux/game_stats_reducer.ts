import { my_net_api } from "../API/api"
import { ResultCodeTypes } from "../API/api_types"
import { OddTypeType } from "./betReducer"
import { KindsOfBetType, PropertiesType, BaseThunkActionType } from "./redux"
import { actions as error_handler_actons, SetErrorMessageAction } from './error_handler_reducer'

const SET_GAME_STATS = 'GAME_STATS_REDUCER/SET_GAME_STATS'
const SET_INITIAL_STATE = 'GAME_STATS_REDUCER/SET_INITIAL_STATE'
const SET_ERROR_MESSAGES = 'GAME_STATS_REDUCER/SET_ERROR_MESSAGES'
const TOGGLE_IS_GETTING_DATA = 'GAME_STATS_REDUCER/TOGGLE_IS_GETTING_DATA'

export const actions = {
    set_game_stats_initial_state: () => ({ type: SET_INITIAL_STATE } as const),
    toggle_is_getting_data: (isGettingData: boolean) => ({ type: TOGGLE_IS_GETTING_DATA, isGettingData } as const),
    set_game_stats: (data: GameStatsDataType) => ({ type: SET_GAME_STATS, data } as const),
    set_error_messages: (error_messages: [] | string[]) => ({type: SET_ERROR_MESSAGES, error_messages} as const)
}

interface GameParameterBaseType {
    [key: string]: number
    home: number
    away: number
}

export type GameKindOfBetDataType = {
    [key: string]: GameParameterBaseType
    expected_IT: GameParameterBaseType
    scores: GameParameterBaseType
    misses: GameParameterBaseType
    total: GameParameterBaseType
    W1: GameParameterBaseType
    X: GameParameterBaseType
    W2: GameParameterBaseType
    TO: GameParameterBaseType
    TU: GameParameterBaseType
}

type GameDataType = {
    [key: string]: GameKindOfBetDataType | undefined
    goals: GameKindOfBetDataType
    yellow_cards?: GameKindOfBetDataType
    corners?: GameKindOfBetDataType
    shots_on_goals?: GameKindOfBetDataType
    fouls?: GameKindOfBetDataType
}

export type BetItemType = {
    odd: number
    odd_type: OddTypeType
    odd_type_for_UI: string
    handicap?: number | null
    total?: number | null
}

export type TwoWayBetsItem = BetItemType[]

type TwoWayBets = {
    [key: string]: TwoWayBetsItem[] | undefined
    totals: TwoWayBetsItem[]
    handicaps?: TwoWayBetsItem[]
}

type ThreeWayBets = {
    [key: string]: BetItemType[] 
    main_outcomes: BetItemType[]
    double_chance: BetItemType[]
}

export type ScoreBoardBetBlockType = {
    [key: string]: TwoWayBets | ThreeWayBets | undefined
    three_way_bets?: ThreeWayBets
    two_way_bets: TwoWayBets
}

export type ScoreBoardKindOfBetDataType = {
    home: number | null
    away: number | null
    bet_block: ScoreBoardBetBlockType
}

export type ScoreBoardDataType = {
    [key: string]: ScoreBoardKindOfBetDataType | undefined
    goals: ScoreBoardKindOfBetDataType
    yellow_cards?: ScoreBoardKindOfBetDataType
    corners?: ScoreBoardKindOfBetDataType
    shots_on_goals?: ScoreBoardKindOfBetDataType
    fouls?: ScoreBoardKindOfBetDataType

}

export type InfoAboutMatchType = {
    home_team: string
    away_team: string
    date_of_match: string
    score: string
    expected_total: number
    expected_result: number
    book_line: {
        w1: number | null
        x: number | null
        w2: number | null
    }
}

export type InfoAboutLastMatchesItemType = {
    [key: string]: Array<InfoAboutMatchType>
    home_team_results: Array<InfoAboutMatchType>
    away_team_results: Array<InfoAboutMatchType>
}

type InfoAboutLastMatchesDataType = {
    goals: InfoAboutLastMatchesItemType
    yellow_cards?: InfoAboutLastMatchesItemType
    corners?: InfoAboutLastMatchesItemType
    fouls?: InfoAboutLastMatchesItemType
    shots_on_goal?: InfoAboutLastMatchesItemType
}

export type GameStatsDataType = {
    basic_totals: {
        goals: number
        yellow_cards?: number
        corners?: number
        fouls?: number
        shots_on_goal?: number
    }
    kinds_of_bet: KindsOfBetType
    date_of_match: string
    names_of_teams: Array<string>
    game: GameDataType
    score_board_block: ScoreBoardDataType
    info_about_last_matches: InfoAboutLastMatchesDataType
}

let innitialObject = {
    isGettingData: true,
    error_messages: [] as [] | string[],
    data: null as GameStatsDataType | null
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

let gameStatsReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    if (action.type === SET_GAME_STATS) {
        return {
            ...state,
            data: action.data
        }
    } else if (action.type === SET_INITIAL_STATE) {
        return innitialObject
    } else if (action.type === TOGGLE_IS_GETTING_DATA) {
        return {
            ...state,
            isGettingData: action.isGettingData
        }
    } else if (action.type === SET_ERROR_MESSAGES) {
        return {
            ...state,
            error_messages: action.error_messages
        }
    }else return state;
}

export const setGameStatsTC = (name_of_championship: string, games_id: number): BaseThunkActionType<ActionsTypes | SetErrorMessageAction> => async dispatch => {
    dispatch(actions.toggle_is_getting_data(true));
    let response = await my_net_api.get_game_stats(name_of_championship, games_id);
    if(response.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.set_game_stats(response.data));
    } else {
        dispatch(error_handler_actons.set_error(response.error_messages))
        dispatch(actions.set_game_stats_initial_state())
    }
    dispatch(actions.toggle_is_getting_data(false));
}

export default gameStatsReducer