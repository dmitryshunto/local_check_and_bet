export enum ResultCodeTypes {
    Success = 0,
    Error = 1
}

export interface BaseAPIType {
    error_messages: string[] | []
    resultCode: number
}

export interface AuthorizeType extends BaseAPIType {
    login: string
}

export type ServerResponseType<D> ={
    error_messages: string[] | []
    resultCode: ResultCodeTypes
    data: D
}

export type AuthData = {
    login: string
    last_seen_public_prediction_id: number
    new_predictions: number
}
