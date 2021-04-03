import { users_api } from "../API/api";
import { ResultCodeTypes } from "../API/api_types";
import { Kinds_of_bet_type } from "./my_net_main_page_reducer";
import { PropertiesType, BaseThunkActionType } from "./redux"
import { actions as error_handler_actions } from './error_handler_reducer';

const SET_MY_PROFILE_DATA = 'MY_PROFILE_REDUCER/SET_MY_PROFILE_DATA'
const TOGGLE_IS_GETTING_DATA = 'MY_PROFILE_REDUCER/TOGGLE_IS_GETTING_DATA'
const SET_INITIAL_STATE = 'MY_PROFILE_REDUCER/SET_INITIAL_STATE'
const UPDATE_PHOTO_URL = 'MY_PROFILE_REDUCER/UPDATE_PHOTO_URL'
const TOGGLE_IS_LOADING_PHOTO = 'MY_PROFILE_REDUCER/TOGGLE_IS_LOADING_PHOTO'
const SET_UPDATE_PHOTO_URL_WARNING_MESSAGE = 'MY_PROFILE_REDUCER/SET_UPDATE_PHOTO_URL_WARNING_MESSAGE'

export const actions = {
    set_my_profile_data: (payload: UserDataType) => ({ type: SET_MY_PROFILE_DATA, payload } as const),
    toggle_is_getting_data: (isGettingData: boolean) => ({ type: TOGGLE_IS_GETTING_DATA, isGettingData } as const),
    set_my_profile_page_initial_state: () => ({ type: SET_INITIAL_STATE } as const),
    update_photo_url: (photo_url: string | null) => ({ type: UPDATE_PHOTO_URL, photo_url } as const),
    toogle_is_loading_photo: (isLoadingPhoto: boolean) => ({ type: TOGGLE_IS_LOADING_PHOTO, isLoadingPhoto } as const),
    set_update_photo_url_warning_message: (warning_message: null | string[]) => {
        return ({ type: SET_UPDATE_PHOTO_URL_WARNING_MESSAGE, warning_message } as const)
    }
}

export type MyProfileDataItemType = {
    bet_id: number
    name_of_championship: string
    kind_of_bet: Kinds_of_bet_type
    home_team: string
    away_team: string
    market: string
    odd_type: string
    odd: number
    result: number | null
    balance: number | null
    result_of_match: string | null
    date_of_match: string
}

export type MyProfileBets = Array<MyProfileDataItemType> | null


export interface UserDataType {
    user_bets: MyProfileBets
    photo_url: string | null
    default_photo_url: string
}

let innitialObject = {
    isGettingData: true,
    isLoadingPhoto: false,
    bets: null as MyProfileBets,
    default_photo_url: null as string | null,
    photo_url: null as string | null,
    warning_message: null as string[] | null
}
type ActionsTypes = ReturnType<PropertiesType<typeof actions>> | ReturnType<typeof error_handler_actions.set_error>

const myProfileReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    if (action.type === SET_MY_PROFILE_DATA) {
        return {
            ...state,
            bets: action.payload.user_bets,
            default_photo_url: action.payload.default_photo_url,
            photo_url: action.payload.photo_url
        }
    } else if (action.type === TOGGLE_IS_GETTING_DATA) {
        return {
            ...state,
            isGettingData: action.isGettingData
        }
    } else if (action.type === SET_INITIAL_STATE) {
        return innitialObject
    } else if (action.type === UPDATE_PHOTO_URL) {
        return {
            ...state,
            photo_url: action.photo_url
        }
    } else if (action.type === SET_UPDATE_PHOTO_URL_WARNING_MESSAGE) {
        return {
            ...state,
            warning_message: action.warning_message
        }
    } else if (action.type === TOGGLE_IS_LOADING_PHOTO) {
        return {
            ...state,
            isLoadingPhoto: action.isLoadingPhoto
        }
    } else return state;
}

export const setMyProfileDataTC = (): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    dispatch(actions.toggle_is_getting_data(true))
    const response = await users_api.get_my_profile()
    if (response.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.set_my_profile_data({...response.data}))
        dispatch(error_handler_actions.set_error(null))
    } else if (response.resultCode === ResultCodeTypes.Error) {
        dispatch(error_handler_actions.set_error(response.error_messages))
    }
    dispatch(actions.toggle_is_getting_data(false))
}

export const updatePhotoTC = (photo_file: File | Blob): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    dispatch(actions.toogle_is_loading_photo(true))
    const response = await users_api.upload_profile_avatar(photo_file)
    if (response.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.update_photo_url(response.data))
        dispatch(actions.set_update_photo_url_warning_message(null))
    } else if (response.resultCode === ResultCodeTypes.Error) {
        dispatch(actions.set_update_photo_url_warning_message(response.error_messages))
    }
    dispatch(actions.toogle_is_loading_photo(false))
    // dispatch(actions.toggle_is_getting_data(true))
    // dispatch(actions.toggle_is_getting_data(false))
}

export default myProfileReducer;