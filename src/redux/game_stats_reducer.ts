import { getGameStats } from "../API/api"
import { KindsOfBetType, PropertiesType, BaseThunkActionType } from "./redux"


const SET_GAME_STATS = 'GAME_STATS_REDUCER/SET_GAME_STATS'
const SET_INITIAL_STATE = 'GAME_STATS_REDUCER/SET_INITIAL_STATE'
const TOGGLE_IS_GETTING_DATA = 'GAME_STATS_REDUCER/TOGGLE_IS_GETTING_DATA'

export const actions = {
    set_game_stats_initial_state: () => ({type: SET_INITIAL_STATE} as const),
    toggle_is_getting_data: (isGettingData: boolean) => ({type: TOGGLE_IS_GETTING_DATA, isGettingData} as const),
    set_game_stats: (data: GameStatsDataType) => ({ type: SET_GAME_STATS, data } as const)
} 

interface GameParameterBaseType {
    [key: string]: number
}

interface ExpectedITType extends GameParameterBaseType {
    expected_of_home_team: number
    expected_of_away_team: number
} 

interface PowerRatingType extends GameParameterBaseType {
    power_of_home_playing_of_team1: number
    power_of_away_playing_of_team2: number
} 

interface ScoresType extends GameParameterBaseType {
    home_per_game_scored_of_team1: number
    away_per_game_scored_of_team2: number
} 

interface MissesType extends GameParameterBaseType {
    home_per_game_missed_of_team1: number
    away_per_game_missed_of_team2: number
}

interface TotalType extends GameParameterBaseType {
    home_total_per_game_of_team1: number
    away_total_per_game_of_team2: number
}

interface W1Type extends GameParameterBaseType {
    home_win1_of_team1: number
    away_win1_of_team2: number
}

interface XType extends GameParameterBaseType {
    home_x_of_team1: number
    away_x_of_team2: number
}

interface W2Type extends GameParameterBaseType {
    home_win2_of_team1: number
    away_win2_of_team2: number
}

interface TOType extends GameParameterBaseType {
    home_over_of_team1: number
    away_over_of_team2: number
}

interface TUType extends GameParameterBaseType {
    home_under_of_team1: number
    away_under_of_team2: number
}

export type GameKindOfBetDataType = {
    [key: string]: ExpectedITType | PowerRatingType | ScoresType | MissesType | TotalType | W1Type | XType | W2Type | TOType | TUType
    expected_IT: ExpectedITType
    power_rating: PowerRatingType
    scores: ScoresType
    misses: MissesType
    total: TotalType
    W1: W1Type
    X: XType
    W2: W2Type
    TO: TOType
    TU: TUType
}

type GameDataType = {
    [key: string]: GameKindOfBetDataType | undefined
    goals: GameKindOfBetDataType
    ycard?: GameKindOfBetDataType
    corners?: GameKindOfBetDataType
}

type BetItemType = {
    odd: number
    odd_type: string
    odd_type_for_UI: string
}

interface TwoWayBetItemType {
    leftblock: BetItemType
    rightblock: BetItemType
}

interface ThreeWayBetItemType extends TwoWayBetItemType {
    centerblock: BetItemType
}

export type ScoreBoardBetBlockType = {
    three_way_bets?: {
        result: ThreeWayBetItemType
        double_chance: ThreeWayBetItemType
    }
    two_way_bets: {
        total: TwoWayBetItemType
        handicap?: TwoWayBetItemType
    }
}

export type ScoreBoardKindOfBetDataType = {
    team1: number | null
    team2: number | null
    bet_block: ScoreBoardBetBlockType
}

export type ScoreBoardDataType = {
    [key: string]: ScoreBoardKindOfBetDataType | undefined 
    goals: ScoreBoardKindOfBetDataType
    ycard?: ScoreBoardKindOfBetDataType
    corners?: ScoreBoardKindOfBetDataType
}

type AnalysisBlockTeamResultsType = {
    [key: string]: number
    win: number
    draw: number
    lose: number
}

export type AnalysisBlockItemType = {
    [key: string]: AnalysisBlockTeamResultsType
    home_team_results: AnalysisBlockTeamResultsType
    away_team_results: AnalysisBlockTeamResultsType
}

type AnalysisBlockDataType = {
    goals: AnalysisBlockItemType
    ycard?: AnalysisBlockItemType
    corners?: AnalysisBlockItemType
}

export type InfoAboutMatchType = {
    home_team: string
    away_team: string
    opp_power: number
    date_of_match: string
    score: string
    expected_total: number
    expected_result: number
    referee?: string
}

export type InfoAboutLastMatchesItemType = {
    home_team_results: Array<InfoAboutMatchType>
    away_team_results: Array<InfoAboutMatchType>
}

type InfoAboutLastMatchesDataType = {
    goals: InfoAboutLastMatchesItemType
    ycard?: InfoAboutLastMatchesItemType
    corners?: InfoAboutLastMatchesItemType
}

export type GameStatsDataType = {
    basic_totals: {
        goals: number
        ycard?: number
        corners?: number
    }
    kinds_of_bet: KindsOfBetType
    date_of_match: string
    names_of_teams: Array<string>
    game: GameDataType
    score_board_block: ScoreBoardDataType
    analysis_block: AnalysisBlockDataType
    info_about_last_matches: InfoAboutLastMatchesDataType
}

let innitialObject = {
    isGettingData: false,
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
    } else return state;
}

export const setGameStatsTC = (name_of_championship: string, games_id: number): BaseThunkActionType<ActionsTypes> => async dispatch => {
    dispatch(actions.toggle_is_getting_data(true));
    let response = await getGameStats(name_of_championship, games_id);
    dispatch(actions.set_game_stats(response.data));
    dispatch(actions.toggle_is_getting_data(false));
}

export default gameStatsReducer;