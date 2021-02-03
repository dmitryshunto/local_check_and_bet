import { getUserData, uploadProfilePhoto } from "../API/api";
import { ResultCodeTypes } from "../API/api_types";
import { KindOfBetType, PropertiesType, BaseThunkActionType } from "./redux"

const SET_MY_PROFILE_DATA = 'MY_PROFILE_REDUCER/SET_MY_PROFILE_DATA'
const TOGGLE_IS_GETTING_DATA = 'MY_PROFILE_REDUCER/TOGGLE_IS_GETTING_DATA'
const SET_INITIAL_STATE = 'MY_PROFILE_REDUCER/SET_INITIAL_STATE'
const UPDATE_PHOTO_URL = 'MY_PROFILE_REDUCER/UPDATE_PHOTO_URL'
const TOGGLE_IS_LOADING_PHOTO = 'MY_PROFILE_REDUCER/TOGGLE_IS_LOADING_PHOTO'
const SET_UPDATE_PHOTO_URL_WARNING_MESSAGE = 'MY_PROFILE_REDUCER/SET_UPDATE_PHOTO_URL_WARNING_MESSAGE'

export const actions = {
    set_my_profile_data: (data: MyProfileDataType) => ({type: SET_MY_PROFILE_DATA, data} as const),
    toggle_is_getting_data: (isGettingData: boolean) => ({type: TOGGLE_IS_GETTING_DATA, isGettingData} as const),
    set_my_profile_page_initial_state: () => ({type: SET_INITIAL_STATE} as const),
    update_photo_url: (photo_url: string | null) => ({type: UPDATE_PHOTO_URL, photo_url} as const),
    toogle_is_loading_photo: (isLoadingPhoto: boolean) => ({type: TOGGLE_IS_LOADING_PHOTO, isLoadingPhoto} as const),
    set_update_photo_url_warning_message: (warning_message: null | string) => {
        return ({type: SET_UPDATE_PHOTO_URL_WARNING_MESSAGE, warning_message} as const)}
}

export type MyProfileDataItemType = {
    bet_id: number
    name_of_championship: string
    kind_of_bet: KindOfBetType
    name_of_team1: string
    name_of_team2: string
    market: string
    odd_type: string
    odd: number
    result: number
    balance: number
    result_of_match: string 
    date_of_match: string
}

export type MyProfileDataType = Array<MyProfileDataItemType> | null

let innitialObject = {
    isGettingData: false,
    isLoadingPhoto: false,
    data: null as MyProfileDataType,
    photo_url: 'http://localhost/uploades/3.jpg' as string | null,
    warning_message: null as string | null
}
type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

const myProfileReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    if(action.type === SET_MY_PROFILE_DATA) {
        return {
            ...state,
            data: action.data
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

export const setMyProfileDataTC = (user_login: string): BaseThunkActionType<ActionsTypes> => async (dispatch: any) => {
    dispatch(actions.toggle_is_getting_data(true))
    const response = await getUserData(user_login)
    dispatch(actions.set_my_profile_data(response.data.user_bets))
    dispatch(actions.update_photo_url(response.data.user_info.photo_url))
    dispatch(actions.toggle_is_getting_data(false))
}

export const updatePhotoTC = (photo_file: File): BaseThunkActionType<ActionsTypes> => async (dispatch: any) => {
    dispatch(actions.toogle_is_loading_photo(true))
    const response = await uploadProfilePhoto(photo_file) 
    if(response.resultCode === ResultCodeTypes.Success) {
        dispatch(actions.update_photo_url(response.data))
        dispatch(actions.set_update_photo_url_warning_message(null))
    } else if (response.resultCode === ResultCodeTypes.Error) {
        dispatch(actions.set_update_photo_url_warning_message(response.message))
    }
    dispatch(actions.toogle_is_loading_photo(false))
}

export default myProfileReducer;