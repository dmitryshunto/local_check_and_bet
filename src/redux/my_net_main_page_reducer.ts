import { my_net_api } from "../API/api";
import { getTodayDate } from "../CommonFunctions/commonFunctions";
import { ResultCodeTypes } from '../API/api_types'
import { PropertiesType, BaseThunkActionType } from "./redux"
import { changeCheckedChampionshipStatus, create_new_date_for_checked_championsips_storage, delete_data_about_checked_championship_from_storage, isChamponshipChecked } from "../Coookie/cookie";

const SET_ALL_PREDICTIONS = 'MY_NET_MAIN_PAGE_REDUCER/SET_ALL_PREDICTION';
const SET_DATE_OF_PREDICTION = 'MY_NET_MAIN_PAGE_REDUCER/SET_DATE_OF_PREDICTION'
const SELECT_DATE_OF_PREDICTION = 'MY_NET_MAIN_PAGE_REDUCER/SELECT_DATE_OF_PREDICTION'
const TOGGLE_IS_GETTING_DATA = 'MY_NET_MAIN_PAGE_REDUCER/TOGGLE_IS_GETTING_DATA'
const SET_INITIAL_STATE = 'MY_NET_MAIN_PAGE_REDUCER/SET_INITIAL_STATE'
const CHANGE_CHAMPIONSHIP_CHECKED_STATUS = 'MY_NET_MAIN_PAGE_REDUCER/CHANGE_CHAMPIONSHIP_CHECKED_STATUS'

export type Kinds_of_bet_type = 'goals' | 'yellow_cards' | 'corners' | 'shots_on_goal' | 'fouls'

export const my_net_kinds_of_bet: Kinds_of_bet_type[] = ['goals', 'yellow_cards', 'corners', 'shots_on_goal', 'fouls']

export interface MyNetGameType {
    [key: string]: string | MyNetPredictionKindOfBetType | undefined | number
    home_team_name: string,
    away_team_name: string,
    date_of_match: string,
    db_name: string
    game_id: number
    goals: MyNetPredictionKindOfBetType,
    yellow_cards?: MyNetPredictionKindOfBetType,
    corners?: MyNetPredictionKindOfBetType,
    shots_on_goal?: MyNetPredictionKindOfBetType,
    fouls?: MyNetPredictionKindOfBetType
}

export type MainOutcomesBookNames = {
    [key: string]: number | null
    w1: number | null;
    x: number | null;
    w2: number | null
}

export interface MyNetPredictionKindOfBetType {
    [key: string]: number | string | null | TotalPropbability | OutcomeProbability | MainOutcomesBookNames
    home_team_scored: number | null;
    away_team_scored: number | null;
    expected_home_team: number | null;
    expected_away_team: number | null;
    expected_result: number;
    expected_total: number | null;
    outcome_bet_team: string | null;
    handicap: number | null;
    over_under_bet_type: string | null;
    over_under_bet_total: number | null;
    book: MainOutcomesBookNames
    basic_total: number | null
    total_probability: TotalPropbability
    outcome_probability: OutcomeProbability
}

type TotalPropbability = {
    TO: number
    TU: number
    BACK: number
}

type OutcomeProbability = {
    [key: string]: number
    home: number
    away: number
    x: number
}

export type MyNetChampionship = {
    checked: boolean | undefined,
    country_name: string,
    name_of_championship: string,
    season: string,
    predictions: MyNetGameType[]
    db_name: string
}

export const actions = {
    setAllPredictions: (data: MyNetChampionship[] | null) => ({ type: SET_ALL_PREDICTIONS, data } as const),
    setDateOfPrediction: (date_of_prediction: string) => ({ type: SET_DATE_OF_PREDICTION, date_of_prediction } as const),
    toogleIsGettingData: (isGettingPrediction: boolean) => ({ type: TOGGLE_IS_GETTING_DATA, isGettingPrediction } as const),
    set_my_net_main_page_initial_state: () => ({ type: SET_INITIAL_STATE } as const),
    selectDateOfPrediction: (selected_date_of_prediction: string) => ({ type: SELECT_DATE_OF_PREDICTION, selected_date_of_prediction } as const),
    changeChampionshipCheckedStatus: (db_name: string, date: string) => ({type: CHANGE_CHAMPIONSHIP_CHECKED_STATUS, db_name, date} as const)
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
        if (action.data) {
            const with_checking_predictions = action.data.map(prediction => {
                return {
                    ...prediction,
                    checked: isChamponshipChecked(prediction.name_of_championship, state.date_of_prediction)
                }
            })
            return {
                ...state,
                data: with_checking_predictions
            }
        } else return {
            ...state,
            data: action.data
        }
    } else if (action.type === SET_DATE_OF_PREDICTION) {
        create_new_date_for_checked_championsips_storage(action.date_of_prediction)
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
    } else if (action.type === CHANGE_CHAMPIONSHIP_CHECKED_STATUS) {
        changeCheckedChampionshipStatus(action.db_name, action.date)
        if(state.data) {
            const with_checking_predictions = state.data.map(prediction => {
                return {
                    ...prediction,
                    checked: isChamponshipChecked(prediction.db_name, action.date)
                }
            })
            return {
                ...state,
                data: with_checking_predictions
            }
        } else return state    
    } else return state;
}

export const set_my_net_predictionsTC = (date_of_prediction: string): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    dispatch(actions.toogleIsGettingData(true))    
    dispatch(actions.setDateOfPrediction(date_of_prediction))
    dispatch(actions.selectDateOfPrediction(date_of_prediction))
    delete_data_about_checked_championship_from_storage()
    let response = await my_net_api.get_predictions(date_of_prediction)
    if (response.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.setAllPredictions(response.data))
    } else if (response.resultCode === ResultCodeTypes.Error) {
        dispatch(actions.setAllPredictions(null))
    } 
    dispatch(actions.toogleIsGettingData(false))
}

export default my_net_main_page_reducer;
