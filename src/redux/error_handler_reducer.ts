import { PropertiesType } from "./redux"

const SET_ERROR = 'ERROR_HANDLER_REDUCER/SET_ERROR'
const SET_WARNING = 'ERROR_HANDLER_REDUCER/SET_WARNING'

export const actions = {
    set_error: (error_message: string[] | null) => ({type: SET_ERROR, error_message} as const),
    set_warning: (warning_messages: string[] | null) =>({type: SET_WARNING, warning_messages} as const)
}

export type SetWarningMessagesAction = ReturnType<typeof actions.set_warning>
export type SetErrorMessageAction = ReturnType<typeof actions.set_error>

let innitialObject = {
    error_message: null as string[] | null,
    warning_messages: null as string[] | null
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

let error_handler_reducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    switch (action.type) {
        case SET_ERROR: {
            return {
                ...state,
                error_message: action.error_message
            }
        } case SET_WARNING: {
            return {
                ...state,
                warning_messages:action.warning_messages
            }
        }
        default: return state
    }    
}

export default error_handler_reducer