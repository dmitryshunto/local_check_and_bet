import { amIAuthorized, loginUser } from "../API/api";
import { setCookie, deleteCookie } from "../Coookie/cookie";
import { SetInitialStateCNUreducer, actions as createNewUserActions } from "./createNUReducer";
import { SetInitialBetReducerState, actions as betReducerActions } from "./betReducer"
import { ResultCodeTypes } from '../API/api_types'
import { AppStoreType, PropertiesType } from "./redux"
import { ThunkAction } from 'redux-thunk'


const SET_AUTORIZATION = 'AUTH_REDUCER/SET_AUTORIZATION';
const TOGGLE_IS_LOGGING_USER = 'AUTH_REDUCER/TOGGLE_IS_LOGGING_USER'

type setAutorizationType = {
    login: string | null
    isAuthorized: boolean
    warningMessage: string | null
}

export const actions = {
    setAutorization: (object: setAutorizationType) => ({ type: SET_AUTORIZATION, object} as const),
    toggleIsLoggingUser: (isLoggingUser: boolean) => ({ type: TOGGLE_IS_LOGGING_USER, isLoggingUser} as const)
}

// по умолчанию устанавливаем isLoggingUser true, потому что при старете приложения
// первым делом начинаем проверку залогининости пользователя

const innitialObject = {
    isLoggingUser: true,
    isAuthorized: false,
    login: null as string | null,
    warningMessage: null as string | null
};

type ActionTypes = ReturnType<PropertiesType<typeof actions>> | SetInitialStateCNUreducer | SetInitialBetReducerState

let authReducer = (state = innitialObject, action: ActionTypes): typeof innitialObject => {
    if (action.type === SET_AUTORIZATION) {
        return {
            ...state,
            ...action.object
        }
    } else if (action.type === TOGGLE_IS_LOGGING_USER) {
        return {
            ...state,
            isLoggingUser: action.isLoggingUser
        }
    } else return state
}

export const amIAuthorizedTC = (): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch) => {
    dispatch(actions.toggleIsLoggingUser(true));
    const response = await amIAuthorized();
    if (response.data.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.setAutorization({
            login: response.data.login,
            isAuthorized: true,
            warningMessage: null
        }));
    } else if (response.data.resultCode === ResultCodeTypes.Error) {
        dispatch(actions.setAutorization({
            login: null,
            isAuthorized: false,
            warningMessage: response.data.message
        }))
    }
    dispatch(actions.toggleIsLoggingUser(false));
}

export const loginUserTC = (login: string, password: string): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch) => {
    dispatch(actions.toggleIsLoggingUser(true));
    let response = await loginUser(login, password);
    if (response.data.resultCode === 0) {
        dispatch(actions.setAutorization({
            isAuthorized: true,
            login: login,
            warningMessage: null
        }));
        setCookie('LoggedUserLogin', login, 100);
    } else {
        dispatch(actions.setAutorization({
            isAuthorized: false,
            login: null,
            warningMessage: response.data.message
        }));
    }
    dispatch(actions.toggleIsLoggingUser(false))
}

export const logoutUserTC = (login: string): ThunkAction<Promise<void>, AppStoreType, unknown, ActionTypes> => async (dispatch) => {
    deleteCookie('LoggedUserLogin');
    dispatch(actions.setAutorization({
        isAuthorized: false,
        login: null,
        warningMessage: null
    }));
    dispatch(createNewUserActions.set_initial_state())
    dispatch(betReducerActions.setInitialBetsReducerState())    
}

export default authReducer;