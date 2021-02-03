import {MyProfileDataType} from '../redux/my_profile_reducer'

export enum ResultCodeTypes {
    Success = 0,
    Error = 1
}

export interface BaseAPIType {
    message: string
    resultCode: number
}

export interface AuthorizeType extends BaseAPIType {
    login: string
}

export interface LoginType extends AuthorizeType {
    id: number
}

export interface UserDataType {
    data: {
        user_bets: MyProfileDataType
        user_info: {
            photo_url: string | null
        }
    } 
    resultCode: number
}

export type ServerResponseType<D> ={
    message: string
    resultCode: number
    data: D
}
