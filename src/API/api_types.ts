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
