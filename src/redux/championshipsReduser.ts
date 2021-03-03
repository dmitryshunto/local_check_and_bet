import { getPredictions } from "../API/api";
import { getTodayDate } from "../CommonFunctions/commonFunctions";
import { ResultCodeTypes } from '../API/api_types'
import { PropertiesType, BaseThunkActionType } from "./redux"
import { changeCheckedChampionshipStatus, create_new_date_for_checked_championsips_storage, delete_data_about_checked_championship_from_storage, isChamponshipChecked } from '../Coookie/cookie';

const SET_ALL_PREDICTIONS = 'CHAMPIONSHIPS_REDUCER/SET_ALL_PREDICTION';
const SET_DATE_OF_PREDICTION = 'CHAMPIONSHIPS_REDUCER/SET_DATE_OF_PREDICTION'
const SELECT_DATE_OF_PREDICTION = 'CHAMPIONSHIPS_REDUCER/SELECT_DATE_OF_PREDICTION'
const TOGGLE_IS_GETTING_DATA = 'CHAMPIONSHIPS_REDUCER/TOGGLE_IS_GETTING_DATA'
const SET_INITIAL_STATE = 'CHAMPIONSHIPS_REDUCER/SET_INITIAL_STATE'
const CHANGE_CHAMPIONSHIP_CHECKED_STATUS = 'CHAMPIONSHIPS_REDUCER/CHANGE_CHAMPIONSHIP_CHECKED_STATUS'

export type BasicTotalsType = {
    [key: string]: number | undefined
    goals: number
    ycard?: number
    corners?: number
}

export type MainPageOddDataType = {
    odd: number | null
    odd_type: string
}

export type MainPageGameKindOfBetDataType = {
    [key: string]: number | null | MainPageOddDataType[] | boolean
    odd_blocks: MainPageOddDataType[]
    team1_scored: number | null
    team2_scored: number | null
    book_win1: number | null
    book_x: number | null
    book_win2: number | null
    expected_of_home_team2: number
    expected_of_away_team2: number
    expected_result2: number
    expected_total2: number
    expected_win1: number
    expected_x: number
    expected_win2: number
    expected_over: number
    selection_over: boolean
    expected_under: number
    selection_under: boolean
}

export type MainPageGameDataType = {
    [key: string]: MainPageGameKindOfBetDataType | string | number | undefined
    name_of_team1: string
    name_of_team2: string
    games_id: number
    goals: MainPageGameKindOfBetDataType
    ycard?: MainPageGameKindOfBetDataType
    corners?: MainPageGameKindOfBetDataType
}

export type MainPageChampionshipDataType = {
    checked: boolean | undefined
    name_of_championship: string
    basic_totals: BasicTotalsType
    games: MainPageGameDataType[]
}

export const actions = {
    setAllPredictions: (predictions: MainPageChampionshipDataType[] | null) => ({ type: SET_ALL_PREDICTIONS, predictions } as const),
    setDateOfPrediction: (date_of_prediction: string) => ({ type: SET_DATE_OF_PREDICTION, date_of_prediction } as const),
    toogleIsGettingData: (isGettingPrediction: boolean) => ({ type: TOGGLE_IS_GETTING_DATA, isGettingPrediction } as const),
    set_main_page_initial_state: () => ({ type: SET_INITIAL_STATE } as const),
    selectDateOfPrediction: (selected_date_of_prediction: string) => ({ type: SELECT_DATE_OF_PREDICTION, selected_date_of_prediction } as const),
    changeChampionshipCheckedStatus: (name_of_championship: string, date: string) => ({
        type: CHANGE_CHAMPIONSHIP_CHECKED_STATUS,
        name_of_championship, date
    } as const)
}

let innitialObject = {
    isGettingPrediction: true,
    predictions: null as MainPageChampionshipDataType[] | null,
    date_of_prediction: getTodayDate(),
    selected_date_of_prediction: getTodayDate(),
    warningMessage: null as string | null
}

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

let championshipsReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {

    if (action.type === SET_ALL_PREDICTIONS) {
        if (action.predictions) {
            const with_checking_predictions = action.predictions.map(prediction => {
                return {
                    ...prediction,
                    checked: isChamponshipChecked(prediction.name_of_championship, state.date_of_prediction)
                }
            })
            return {
                ...state,
                predictions: with_checking_predictions
            }
        } else return {
            ...state,
            predictions: action.predictions
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
        changeCheckedChampionshipStatus(action.name_of_championship, action.date)
        if(state.predictions) {
            const with_checking_predictions = state.predictions.map(prediction => {
                return {
                    ...prediction,
                    checked: isChamponshipChecked(prediction.name_of_championship, state.date_of_prediction)
                }
            })
            return {
                ...state,
                predictions: with_checking_predictions
            }
        } else return state    
    } else return state;
}

export const setAllPredictionsTC = (date_of_prediction: string): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    dispatch(actions.toogleIsGettingData(true))
    dispatch(actions.setDateOfPrediction(date_of_prediction))
    dispatch(actions.selectDateOfPrediction(date_of_prediction))
    delete_data_about_checked_championship_from_storage()
    let response = await getPredictions(date_of_prediction)
    if (response.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.setAllPredictions(response.data))
    } else if (response.resultCode === ResultCodeTypes.Error) {
        dispatch(actions.setAllPredictions(null))
    } dispatch(actions.toogleIsGettingData(false))
}

export default championshipsReducer;