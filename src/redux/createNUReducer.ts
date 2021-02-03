import {createNewUser} from "../API/api";
import { loginUserTC } from "./authReducer";
import { ResultCodeTypes } from '../API/api_types'
import { BaseThunkActionType, PropertiesType } from "./redux"

const TOGGLE_OF_CREATING_USER_BUTTON = 'CREATE_NEW_USER_REDUCER/TOGGLE_OF_CREATING_USER_BUTTON';
const SET_CREATING_OF_NEW_USER = 'CREATE_NEW_USER_REDUCER/SET_CREATING_OF_NEW_USER';
const SET_INITIAL_STATE = 'CREATE_NEW_USER_REDUCER/SET_INITIAL_STATE';

export const actions = {
    toggle_of_creating_user_button: 
        (isCreatingUser: boolean) => ({type: TOGGLE_OF_CREATING_USER_BUTTON, isCreatingUser} as const), 
    toggle_of_createNewUserSuccess: 
        (object: CreateNewUserSuccessObjectType) => ({type: SET_CREATING_OF_NEW_USER, object} as const),
    set_initial_state: () => ({type: SET_INITIAL_STATE} as const)
}

export type SetInitialStateCNUreducer = ReturnType<typeof actions.set_initial_state>

type CreateNewUserSuccessObjectType = {
    createNewUserSuccess: boolean | null
    newUserLogin: string | null
    createNUwarningMessage: string | null
    isCreatingUser?: boolean
}

export type CreateNewUserSuccessActionType = {
    type: typeof SET_CREATING_OF_NEW_USER
    object: CreateNewUserSuccessObjectType
}

let innitialObject = {
    isCreatingUser: false,
    createNewUserSuccess: null as boolean | null,
    newUserLogin: null as string | null,
    createNUwarningMessage: null as string | null
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>
let createNUReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    if(action.type === TOGGLE_OF_CREATING_USER_BUTTON) {
        return {
            ...state,
            isCreatingUser: action.isCreatingUser
        }
    } else if(action.type === SET_CREATING_OF_NEW_USER) {
        return {
            ...state,
            ...action.object
        }
    } else if (action.type === SET_INITIAL_STATE) {
        return innitialObject
    } else return state;
}

export const createNewUserTC = (login: string, password: string): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    dispatch(actions.toggle_of_creating_user_button(true));
    let response = await createNewUser(login, password);
    if (response.data.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.toggle_of_createNewUserSuccess({
            createNewUserSuccess: true,
            newUserLogin: response.data.login,
            createNUwarningMessage: null
        }))
        dispatch(loginUserTC(login, password));
    } else if (response.data.resultCode !== ResultCodeTypes.Success) {
        dispatch(actions.toggle_of_createNewUserSuccess({
            createNewUserSuccess: false,
            newUserLogin: null,
            createNUwarningMessage: response.data.message
        }));
    }
    dispatch(actions.toggle_of_creating_user_button(false));
}


export default createNUReducer;