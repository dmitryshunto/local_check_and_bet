import { users_api } from "../API/api";
import { SetInitialStateCNUreducer, actions as createNewUserActions } from "./createNUReducer";
import { SetInitialBetReducerState, actions as betReducerActions } from "./betReducer"
import { actions as error_handler_actions } from './error_handler_reducer'
import { AppStoreType, PropertiesType } from "./redux"
import { ThunkAction } from 'redux-thunk'
import { ResultCodeTypes } from "../API/api_types";
import { set_connection, stop_connection, actions as prediction_board_actions } from "./prediction_board";

const SET_AUTORIZATION = 'AUTH_REDUCER/SET_AUTORIZATION';
const TOGGLE_IS_LOGGING_USER = 'AUTH_REDUCER/TOGGLE_IS_LOGGING_USER'
const SET_WARNING_MESSAGE = 'AUTH_REDUCER/SET_WARNING_MESSAGE'

type setAutorizationType = {
    login: string | null
    isAuthorized: boolean
    warningMessage: string[] | null
}

export const actions = {
    setAutorization: (object: setAutorizationType) => ({ type: SET_AUTORIZATION, object } as const),
    toggleIsLoggingUser: (isLoggingUser: boolean) => ({ type: TOGGLE_IS_LOGGING_USER, isLoggingUser } as const),
    setWarningMessage: (message: string[] | null) => ({ type: SET_WARNING_MESSAGE, message } as const)
}

// по умолчанию устанавливаем isLoggingUser true, потому что при старте приложения
// первым делом начинаем проверку залогининости пользователя

const innitialObject = {
    isLoggingUser: true,
    isAuthorized: false,
    login: null as string | null,
    warningMessage: null as string[] | null
};

type OwnActions = ReturnType<PropertiesType<typeof actions>>

let authReducer = (state = innitialObject, action: OwnActions): typeof innitialObject => {
    switch (action.type) {
        case SET_AUTORIZATION: {
            return {
                ...state,
                ...action.object
            }
        } case TOGGLE_IS_LOGGING_USER: {
            return {
                ...state,
                isLoggingUser: action.isLoggingUser
            }
        } case SET_WARNING_MESSAGE: {
            return {
                ...state,
                warningMessage: action.message
            }
        } default: return state
    }
}

export type AmIAuthorizedType = typeof amIAuthorizedTC

type ActionTypes = OwnActions | SetInitialStateCNUreducer | SetInitialBetReducerState |
    ReturnType<PropertiesType<typeof error_handler_actions>> |
    ReturnType<PropertiesType<typeof prediction_board_actions>>

export const amIAuthorizedTC = (): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch) => {
    dispatch(actions.toggleIsLoggingUser(true));
    try {
        const response = await users_api.am_i_authorized();
        if (response.statusText === 'OK') {
            if (response.data.data.login) {
                dispatch(actions.setAutorization({
                    login: response.data.data.login,
                    isAuthorized: true,
                    warningMessage: null
                }))
                await dispatch(set_connection())
                dispatch(prediction_board_actions.set_new_predictions_number(response.data.data.new_predictions))
                dispatch(prediction_board_actions.last_seen_prediction_id_changed(response.data.data.last_seen_public_prediction_id))
            } else {
                dispatch(actions.setAutorization({
                    login: null,
                    isAuthorized: false,
                    warningMessage: null
                }))
            }
            dispatch(error_handler_actions.set_error(null))
        } else {
            dispatch(actions.setAutorization({
                login: null,
                isAuthorized: false,
                warningMessage: [response.statusText]
            }))
        }
        dispatch(actions.toggleIsLoggingUser(false));
    } catch (e) {
        dispatch(actions.toggleIsLoggingUser(false))
        dispatch(actions.setWarningMessage(['Authorization error']))
    }
}

export const loginUserTC = (login: string, password: string): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch) => {
    dispatch(actions.toggleIsLoggingUser(true));
    let response = await users_api.login_user(login, password);
    if (response.data.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.setAutorization({
            isAuthorized: true,
            login,
            warningMessage: null
        }))
        await dispatch(set_connection())
    } else if (response.data.resultCode === ResultCodeTypes.Error) {
        dispatch(actions.setAutorization({
            isAuthorized: false,
            login: null,
            warningMessage: response.data.error_messages
        }));
    }
    dispatch(actions.toggleIsLoggingUser(false))
}

export const logoutUserTC = (): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch) => {
    let response = await users_api.logout_user()
    if(response.statusText === 'OK') {
        dispatch(actions.setAutorization({
            isAuthorized: false,
            login: null,
            warningMessage: null
        }));
        dispatch(createNewUserActions.set_initial_state())
        dispatch(betReducerActions.setInitialBetsReducerState())
    }
    await dispatch(stop_connection())
}

export default authReducer;