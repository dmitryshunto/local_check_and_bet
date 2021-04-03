import { get_blob_file, users_api } from "../API/api";
import { loginUserTC } from "./authReducer";
import { ResultCodeTypes } from '../API/api_types'
import { BaseThunkActionType, PropertiesType } from "./redux"
import { actions as error_handler_actions } from './error_handler_reducer';
import { updatePhotoTC } from "./my_profile_reducer";
import axios from 'axios'

const TOGGLE_IS_GETTING_DATA = 'CREATE_NEW_USER_REDUCER/TOGGLE_IS_GETTING_DATA'
const SET_CREATING_OF_NEW_USER = 'CREATE_NEW_USER_REDUCER/SET_CREATING_OF_NEW_USER'
const SET_INITIAL_STATE = 'CREATE_NEW_USER_REDUCER/SET_INITIAL_STATE'
const SET_DEFAULT_PHOTO_URL = 'CREATE_NEW_USER_REDUCER/SET_DEFAULT_PHOTO_URL'
const SET_PHOTO_FILE = 'CREATE_NEW_USER_REDUCER/SET_PHOTO_FILE'
const TOGGLE_IS_LOADING_PHOTO = 'CREATE_NEW_USER_REDUCER/TOGGLE_IS_LOADING_PHOTO'

export const actions = {
    toggle_of_getting_data:
        (is_getting_data: boolean) => ({ type: TOGGLE_IS_GETTING_DATA, is_getting_data } as const),
    toggle_of_createNewUserSuccess:
        (object: CreateNewUserSuccessObjectType) => ({ type: SET_CREATING_OF_NEW_USER, object } as const),
    set_initial_state: () => ({ type: SET_INITIAL_STATE } as const),
    set_default_photo_url: (default_photo_url: string) => ({ type: SET_DEFAULT_PHOTO_URL, default_photo_url } as const),
    set_photo_file: (photo_file_url: string | null) => ({ type: SET_PHOTO_FILE, photo_file_url } as const),
    toggle_is_loading_photo: (isLoadingPhoto: boolean) => ({type: TOGGLE_IS_LOADING_PHOTO, isLoadingPhoto}  as const)
}

export type SetInitialStateCNUreducer = ReturnType<typeof actions.set_initial_state>

type CreateNewUserSuccessObjectType = {
    createNewUserSuccess: boolean | null
    newUserLogin: string | null
    warning_messages: string[] | null
    isCreatingUser?: boolean
}

export type CreateNewUserSuccessActionType = {
    type: typeof SET_CREATING_OF_NEW_USER
    object: CreateNewUserSuccessObjectType
}

let innitialObject = {
    is_getting_data: false,
    default_photo_url: null as string | null,
    isLoadingPhoto: false,
    avatar_photo_file_url: null as string | null,
    createNewUserSuccess: null as boolean | null,
    newUserLogin: null as string | null,
    warning_messages: null as string[] | null
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>> | ReturnType<typeof error_handler_actions.set_error>
let createNUReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    if (action.type === TOGGLE_IS_GETTING_DATA) {
        return {
            ...state,
            is_getting_data: action.is_getting_data
        }
    } else if (action.type === SET_CREATING_OF_NEW_USER) {
        return {
            ...state,
            ...action.object
        }
    } else if (action.type === SET_INITIAL_STATE) {
        return {...innitialObject,
            default_photo_url: state.default_photo_url
        }
    } else if (action.type === SET_DEFAULT_PHOTO_URL) {
        return {
            ...state,
            default_photo_url: action.default_photo_url
        }
    } else if (action.type === SET_PHOTO_FILE) {
        return {
            ...state,
            avatar_photo_file_url: action.photo_file_url
        }
    } else if (action.type === TOGGLE_IS_LOADING_PHOTO) {
        return {
            ...state,
            isLoadingPhoto: action.isLoadingPhoto
        }
    } else return state;
}

export const add_user_photo_to_stateTC = (photo_file: File): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    dispatch(actions.toggle_is_loading_photo(true))
    const localImageUrl =  window.URL.createObjectURL(photo_file);
    dispatch(actions.set_photo_file(localImageUrl))
    dispatch(actions.toggle_is_loading_photo(false))
}

export const set_info_for_creating_userTC = (): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    dispatch(actions.toggle_of_getting_data(true))
    const response = await users_api.get_create_new_user_page_info()
    if(response.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.set_default_photo_url(response.data.default_photo_url))
    } else if (response.resultCode === ResultCodeTypes.Error) {
        dispatch(error_handler_actions.set_error(response.error_messages))
    }
    dispatch(actions.toggle_of_getting_data(false))
}

export const createNewUserTC = (login: string, password: string): BaseThunkActionType<ActionsTypes> => async (dispatch, getState) => {
    dispatch(actions.toggle_of_getting_data(true));
    const blob_photo_url = getState().createNU.avatar_photo_file_url
    let response = await users_api.create_new_user(login, password);
    if (response.data.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.toggle_of_createNewUserSuccess({
            createNewUserSuccess: true,
            newUserLogin: response.data.login,
            warning_messages: null
        }))
        await dispatch(loginUserTC(login, password))
        if(blob_photo_url) {
            let blob = await fetch(blob_photo_url).then(r => r.blob())
            const file = new File([blob], 'new.png', { type: 'image/png' });
            await dispatch(updatePhotoTC(file))
        }
    } else if (response.data.resultCode !== ResultCodeTypes.Success) {
        dispatch(actions.toggle_of_createNewUserSuccess({
            createNewUserSuccess: false,
            newUserLogin: null,
            warning_messages: response.data.error_messages
        }));
    }
    dispatch(actions.toggle_of_getting_data(false));
}


export default createNUReducer;
