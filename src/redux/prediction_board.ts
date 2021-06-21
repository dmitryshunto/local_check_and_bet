import { ThunkAction } from "redux-thunk";
import { BaseAPIType, ResultCodeTypes } from "../API/api_types"
import { AppStoreType, NewKindOfBet, PropertiesType } from "./redux";
import { actions as error_handler_actions } from './error_handler_reducer'
import { OddTypeType } from "./betReducer"
import { EventType, prediction_board_api } from "../API/websocket";
import { users_api } from "../API/api";
import UIfx from 'uifx'
import { Dispatch } from "redux";

const notification_sound_file = require('../sounds/new_prediction.mp3')
const notification_sound = new UIfx(notification_sound_file);

const SET_CONNECTION = 'PREDICTION_BOARD/SET_AUTORIZATION';
const TOGGLE_IS_GETTING_DATA = 'PREDICTION_BOARD/TOGGLE_IS_GETTING_DATA'
const SET_WARNING_MESSAGE = 'PREDICTION_BOARD/SET_WARNING_MESSAGE'
const SET_DATA = 'PREDICTION_BOARD/SET_DATA'
const SET_NEW_PREDICTIONS_NUMBER = 'PREDICTION_BOARD/SET_NEW_PREDICTIONS_NUMBER'
const PREDICTION_RECIEVED = 'PREDICTION_BOARD/PREDICTION_RECIEVED'
const PUBLIC_PREDICTION_DELETED = 'PREDICTION_BOARD/PUBLIC_PREDICTION_DELETED'
const PUBLIC_PREDICTION_EDITED = 'PREDICTION_BOARD/PREDICTION_EDITED'
const LAST_SEEN_PREDICTION_ID_CHANGED = 'PREDICTION_BOARD/LAST_SEEN_PREDICTION_ID_CHANGED'
const IS_GETTING_MORE_PREDICTION_CHANGED = 'PREDICTION_BOARD/IS_GETTING_MORE_PREDICTION_CHANGED'
const MORE_PREDICTION_RECIEVED = 'PREDICTION_BOARD/MORE_PREDICTION_RECIEVED'
const ALL_PREDICTIONS_RECIEVED = 'PREDICTION_BOARD/ALL_PREDICTIONS_RECIEVED'

export const actions = {
    set_connection: (is_connected: boolean) => ({ type: SET_CONNECTION, is_connected } as const),
    toggle_is_getting_data: (is_getting_data: boolean) => ({ type: TOGGLE_IS_GETTING_DATA, is_getting_data } as const),
    set_warning_message: (message: string[] | null) => ({ type: SET_WARNING_MESSAGE, message } as const),
    set_new_predictions_number: (new_predictions: number) => ({ type: SET_NEW_PREDICTIONS_NUMBER, new_predictions } as const),
    prediction_recieved: (prediction: PredictionType) => ({ type: PREDICTION_RECIEVED, prediction } as const),
    set_data: (predictions: PredictionType[]) => ({ type: SET_DATA, predictions } as const),
    delete_prediction: (prediction_id: number) => ({ type: PUBLIC_PREDICTION_DELETED, prediction_id } as const),
    prediction_edited: (prediction_id: number, prediction: PredictionType) => ({
        type: PUBLIC_PREDICTION_EDITED, payload: { prediction_id, prediction }
    } as const),
    last_seen_prediction_id_changed: (prediction_id: number) => ({ type: LAST_SEEN_PREDICTION_ID_CHANGED, prediction_id } as const),
    is_getting_more_prediction_changed: (is_getting_more_prediction: boolean) => ({
        type: IS_GETTING_MORE_PREDICTION_CHANGED, is_getting_more_prediction
    } as const),
    more_prediction_recieved: (predictions: PredictionType[]) => ({
        type: MORE_PREDICTION_RECIEVED, predictions
    } as const),
    all_predictions_recieved: (payload: boolean) => ({ type: ALL_PREDICTIONS_RECIEVED, payload } as const)
}

export interface BasePredictionType {
    league_name: string | undefined
    teams: string | undefined
    kind_of_bet: NewKindOfBet
    odd_type: OddTypeType
    value?: number | undefined
    odd: number
    public: boolean
    description: string
    db_name: string
    game_id: number
}

export interface PredictionType extends BasePredictionType {
    user_login: string
    result: number
    result_of_match?: string
    date_of_match: string
    date_of_prediction: string
    id: number
}

const innitialObject = {
    is_connected: false,
    is_getting_data: true,
    is_getting_more_prediction: false,
    are_all_predictions_recieved: false,
    last_seen_prediction_id: null as number | null,
    new_predictions: 0,
    warning_message: null as string[] | null,
    data: [] as PredictionType[]
};

type OwnActions = ReturnType<PropertiesType<typeof actions>>

const prediction_board_reducer = (state = innitialObject, action: ActionTypes): typeof innitialObject => {
    switch (action.type) {
        case SET_CONNECTION: {
            return {
                ...state,
                is_connected: action.is_connected
            }
        } case TOGGLE_IS_GETTING_DATA: {
            return {
                ...state,
                is_getting_data: action.is_getting_data
            }
        } case SET_WARNING_MESSAGE: {
            return {
                ...state,
                warning_message: action.message
            }
        } case SET_DATA: {

            return {
                ...state,
                data: action.predictions
            }
        } case PREDICTION_RECIEVED: {
            return {
                ...state,
                data: [action.prediction, ...state.data]
            }
        } case SET_NEW_PREDICTIONS_NUMBER: {
            return {
                ...state,
                new_predictions: action.new_predictions
            }
        } case PUBLIC_PREDICTION_DELETED: {
            return {
                ...state,
                data: state.data.filter(prediction => prediction['id'] !== action.prediction_id)
            }
        } case PUBLIC_PREDICTION_EDITED: {
            return {
                ...state,
                data: state.data.map(prediction => {
                    if (prediction['id'] === action.payload.prediction_id) return action.payload.prediction
                    return prediction
                })
            }
        } case LAST_SEEN_PREDICTION_ID_CHANGED: {
            return {
                ...state,
                last_seen_prediction_id: action.prediction_id
            }
        } case IS_GETTING_MORE_PREDICTION_CHANGED: {
            return {
                ...state,
                is_getting_more_prediction: action.is_getting_more_prediction
            }
        } case MORE_PREDICTION_RECIEVED: {
            return {
                ...state,
                data: [...state.data, ...action.predictions]
            }
        } case ALL_PREDICTIONS_RECIEVED: {
            return {
                ...state,
                are_all_predictions_recieved: action.payload
            }
        } default: return state
    }
}

type ActionTypes = OwnActions | ReturnType<PropertiesType<typeof error_handler_actions>>

const portion_size = 6

export const setUsersPredictionsTC = (): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch, getState) => {
    dispatch(actions.toggle_is_getting_data(true))
    if (getState().authUser.login) {
        let response = await users_api.get_public_predictions(portion_size)
        if (response.resultCode === ResultCodeTypes.Success) {
            dispatch(actions.set_new_predictions_number(0))
            if(response.data.length) users_api.update_user_last_seen_prediction_id(response.data[0].id)
            if(response.data.length < portion_size) dispatch(actions.all_predictions_recieved(true))
            dispatch(actions.set_data(response.data))
        } else if (response.resultCode === ResultCodeTypes.Error) {
            dispatch(error_handler_actions.set_warning(response.error_messages))
        }
    }
    dispatch(actions.toggle_is_getting_data(false))
}

export const getMoreUsersPredictions = (): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch, getState) => {
    dispatch(actions.is_getting_more_prediction_changed(true))
    const state = getState().prediction_board
    if (state.data.length) {
        const last_id = state.data[state.data.length - 1].id
        let response = await users_api.get_public_predictions(portion_size, last_id)
        if (response.resultCode === ResultCodeTypes.Success) {
            dispatch(actions.more_prediction_recieved(response.data))
            if (response.data.length === 0 || response.data.length < portion_size) dispatch(actions.all_predictions_recieved(true))
        } else if (response.resultCode === ResultCodeTypes.Error) {
            dispatch(error_handler_actions.set_warning(response.error_messages))
        }
    }
    dispatch(actions.is_getting_more_prediction_changed(false))
}

export const set_initial_state = (): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch) => {
    dispatch(actions.set_new_predictions_number(0))
    dispatch(update_user_last_seen_prediction_id())
    dispatch(actions.all_predictions_recieved(false))
    dispatch(actions.is_getting_more_prediction_changed(false))
}

export const update_user_last_seen_prediction_id = (): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch, getState) => {
    const predictions = getState().prediction_board.data
    if (predictions.length) {
        users_api.update_user_last_seen_prediction_id(predictions[0].id)
        dispatch(actions.last_seen_prediction_id_changed(predictions[0].id))
    }
}

const operation_success_handler = (success_message: string, dispatch: Dispatch<ActionTypes>, event: EventType) => {
    const callbackCreator = (success_message: string) => (response: BaseAPIType) => {
        if (response.resultCode === ResultCodeTypes.Success) {
            dispatch(error_handler_actions.set_warning([success_message]))
        } else if (response.resultCode === ResultCodeTypes.Error) {
            dispatch(error_handler_actions.set_warning(response.error_messages))
        }
    }
    prediction_board_api.subscribe<BaseAPIType>(callbackCreator(success_message), event)
}

export const set_connection = (): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch) => {
    prediction_board_api.subscribe<boolean>((status) => {
        dispatch(actions.set_connection(status))
    }, 'status-changed')
    prediction_board_api.subscribe<PredictionType>(async (prediction) => {
        dispatch(recieve_prediction(prediction))
    }, 'predictions-received')
    operation_success_handler('Your prediction has been created', dispatch, 'prediction_sent_success')
    prediction_board_api.subscribe<number>(async (prediction_id) => {
        dispatch(actions.delete_prediction(prediction_id))
    }, 'prediction_deleted')
    operation_success_handler('Prediction has been deleted', dispatch, 'prediction_deleted_success')
    prediction_board_api.subscribe<EditPredictionArgsType>(({ prediction, prediction_id }) => {
        dispatch(actions.prediction_edited(prediction_id, prediction))
    }, 'prediction_edited')
    operation_success_handler('Prediction has been edited', dispatch, 'prediction_edition_success')
    prediction_board_api.start()
}

export const stop_connection = (): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch) => {
    prediction_board_api.stop()
}

const sending_predction_error_handler = (): ThunkAction<Promise<string | null>, AppStoreType, unknown, ActionTypes> => async (dispatch, getState) => {
    const state = getState()
    const login = state.authUser.login
    const is_connected = state.prediction_board.is_connected
    if (!login) dispatch(error_handler_actions.set_warning(['To posting prediction you must be authorized']))
    if (!is_connected) dispatch(error_handler_actions.set_warning(['Connection is lost']))
    if (login && is_connected) return login
    return null
}

export const send_prediction = (prediction: BasePredictionType): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch, getState) => {
    const login = await dispatch(sending_predction_error_handler())
    if (login) prediction_board_api.send_prediction(prediction, login)
}

export const delete_public_prediction = (prediction_id: number): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch, getState) => {
    const login = await dispatch(sending_predction_error_handler())
    if (login) prediction_board_api.delete_public_prediction(prediction_id)
}

const recieve_prediction = (prediction: PredictionType): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch, getState) => {
    const state = getState()
    const current_new_predictions_number = state.prediction_board.new_predictions
    const user_login = state.authUser.login
    dispatch(actions.prediction_recieved(prediction))
    if (prediction['user_login'] !== user_login) {
        dispatch(actions.set_new_predictions_number(current_new_predictions_number + 1))
        notification_sound.play()
    }
}

export type EditPredictionArgsType = {
    prediction_id: number
    prediction: PredictionType
}

export const edit_public_prediction = (prediction: BasePredictionType, prediction_id?: number): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch) => {
    const login = await dispatch(sending_predction_error_handler())
    if (prediction_id && login) prediction_board_api.edit_prediction(prediction_id, prediction)
}

export default prediction_board_reducer