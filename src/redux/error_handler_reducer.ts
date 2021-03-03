import { PropertiesType } from "./redux"

const SET_ERROR = 'ERROR_HANDLER_REDUCER/SET_ERROR'

export const actions = {
    set_error : (error_message: string | null) => ({type: SET_ERROR, error_message} as const),
}
let innitialObject = {
    error_message: null as string | null
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

let error_handler_reducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    switch (action.type) {
        case SET_ERROR : {
            return {
                error_message: action.error_message
            }
        }
        default: return state
    }    
}

export default error_handler_reducer