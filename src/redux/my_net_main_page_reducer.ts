import { my_net_api } from "../API/api";
import { getTodayDate } from "../CommonFunctions/commonFunctions";
import { ResultCodeTypes } from '../API/api_types'
import { PropertiesType, BaseThunkActionType } from "./redux"

const SET_ALL_PREDICTIONS = 'MY_NET_MAIN_PAGE_REDUCER/SET_ALL_PREDICTION';
const SET_DATE_OF_PREDICTION = 'MY_NET_MAIN_PAGE_REDUCER/SET_DATE_OF_PREDICTION'
const SELECT_DATE_OF_PREDICTION = 'MY_NET_MAIN_PAGE_REDUCER/SELECT_DATE_OF_PREDICTION'
const TOGGLE_IS_GETTING_DATA = 'MY_NET_MAIN_PAGE_REDUCER/TOGGLE_IS_GETTING_DATA'
const SET_INITIAL_STATE = 'MY_NET_MAIN_PAGE_REDUCER/SET_INITIAL_STATE'

export type Kinds_of_bet_type = 'goals' | 'yellow_cards' | 'corners' | 'shots_on_goal' | 'fouls'

export const my_net_kinds_of_bet: Kinds_of_bet_type[] = ['goals', 'yellow_cards', 'corners', 'shots_on_goal', 'fouls']

export type MyNetPredictionType = {
    [key: string]: string | MyNetPredictionKindOfBetType | undefined,
    home_team_name: string,
    away_team_name: string,
    date_of_match: string,
    goals: MyNetPredictionKindOfBetType,
    yellow_cards?: MyNetPredictionKindOfBetType,
    corners?: MyNetPredictionKindOfBetType,
    shots_on_goal?: MyNetPredictionKindOfBetType,
    fouls?: MyNetPredictionKindOfBetType 
}

export interface MyNetPredictionKindOfBetType {
    [key: string]: number | string | null;
    home_team_scored: number | null;
    away_team_scored: number | null;
    expected_home_team: number | null;
    expected_away_team: number | null;
    expected_result: number | null;
    expected_total: number | null;
    outcome_bet_team: string | null;
    handicap: number | null;
    book_w1: number | null;
    book_x: number | null;
    book_w2: number | null
}

export type MyNetChampionship = {
    country_name: string,
    name_of_championship: string,
    season: string,
    predictions: MyNetPredictionType[]
}

export const actions = {
    setAllPredictions: (data: MyNetChampionship[] | null) => ({ type: SET_ALL_PREDICTIONS, data } as const),
    setDateOfPrediction: (date_of_prediction: string) => ({type: SET_DATE_OF_PREDICTION, date_of_prediction} as const),
    toogleIsGettingData: (isGettingPrediction: boolean) => ({ type: TOGGLE_IS_GETTING_DATA, isGettingPrediction} as const),
    set_my_net_main_page_initial_state: () => ({type: SET_INITIAL_STATE} as const),
    selectDateOfPrediction: (selected_date_of_prediction: string) => ({type: SELECT_DATE_OF_PREDICTION, selected_date_of_prediction} as const)
} 

let innitialObject = {
    isGettingPrediction: true,
    data: null as MyNetChampionship[] | null,
    date_of_prediction: getTodayDate(),
    selected_date_of_prediction: getTodayDate()
}

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

let my_net_main_page_reducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    
    if (action.type === SET_ALL_PREDICTIONS) {
        return {
            ...state,
            data: action.data
        }
    } else if (action.type === SET_DATE_OF_PREDICTION) {
        return {
            ...state,
            date_of_prediction: action.date_of_prediction
        }
    } else if (action.type === TOGGLE_IS_GETTING_DATA) {
        return {
            ...state,
            isGettingPrediction: action.isGettingPrediction
        }
    } else if (action.type === SELECT_DATE_OF_PREDICTION) {
        return {
            ...state, 
            selected_date_of_prediction: action.selected_date_of_prediction
        }
    } else if (action.type === SET_INITIAL_STATE) {
        return innitialObject
    } else return state;
}

export const set_my_net_predictionsTC = (date_of_prediction: string): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    let response = await my_net_api.get_predictions(date_of_prediction)
    if (response.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.setAllPredictions(response.data))
    } else if (response.resultCode === ResultCodeTypes.Error) {
        dispatch(actions.setAllPredictions(null))
    } dispatch(actions.toogleIsGettingData(false))
    if(date_of_prediction) {
        dispatch(actions.setDateOfPrediction(date_of_prediction))
        dispatch(actions.selectDateOfPrediction(date_of_prediction))
    } 
}

export default my_net_main_page_reducer;