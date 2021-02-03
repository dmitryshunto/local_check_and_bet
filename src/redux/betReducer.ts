import { addBetsToDB } from "../API/api"
import { PropertiesType, BaseThunkActionType } from "./redux"
import { getTodayDate } from "../CommonFunctions/commonFunctions"

const ADD_BET = 'BET_REDUCER/ADD_BET'
const REMOVE_BET = 'BET_REDUCER/REMOVE_BET'
const TOGGLE_IS_ADDING_BET = 'BET_REDUCER/TOGGLE_IS_ADDING_BET'
const ADD_BET_SUCCESS = 'BET_REDUCER/ADD_BET_SUCCESS'
const ADD_BET_ERROR = 'BET_REDUCER/ADD_BET_ERROR'
const SET_INITIAL_STATE = 'BET_REDUCER/SET_INITIAL_STATE'

export type addBetActionType = ReturnType<typeof actions.addBet>
export type removeBetActionType = ReturnType<typeof actions.removeBet>
export type SetInitialBetReducerState = ReturnType<typeof actions.setInitialBetsReducerState>

export const actions = {
    removeBet: (bet: BetType) => ({type: REMOVE_BET, bet} as const),
    addBet: (bet: BetType) => ({type: ADD_BET, bet} as const),
    toggleIsAddingBet: (isAddingBetsToDB: boolean) => ({type: TOGGLE_IS_ADDING_BET, isAddingBetsToDB} as const),
    addBetSuccess: (object: typeof innitialObject) => ({type: ADD_BET_SUCCESS, object} as const),
    addBetError: (message: string) => ({type: ADD_BET_ERROR, message} as const),
    setInitialBetsReducerState: () => ({type: SET_INITIAL_STATE} as const)
}


export type BetType = {
    kind_of_bet: string;
    date_of_match: string;
    name_of_championship: string;
    market: string;
    name_of_team1: string;
    name_of_team2: string;
    odd_type: string;
    odd: number;
}

let innitialObject = {
    bets: [] as Array<BetType> | [],
    isAddingBetsToDB: false,
    addingBetsSuccess: null as boolean | null,
    message: null as string | null
}; 

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

let betReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    
    if (action.type === ADD_BET && action.bet.date_of_match > getTodayDate()) {
        return {
            ...state,
            bets: [...state.bets, action.bet],
            message: null,
            addingBetsSuccess: null
        }
    } else if (action.type === REMOVE_BET) {
        if(state.bets) {
            return {
                ...state,
                bets: state.bets.filter(bet => { return action.bet !== bet})
            }
        } else return state
    } else if (action.type === TOGGLE_IS_ADDING_BET) {
        return {
            ...state,
            isAddingBetsToDB: action.isAddingBetsToDB
        }
    } else if (action.type === ADD_BET_SUCCESS) {
        return {
            ...state,
            ...action.object
        }
    } else if (action.type === ADD_BET_ERROR) {
        return {
            ...state,
            isAddingBetsToDB: false,
            addingBetsSuccess: false,
            message: action.message
        }
    }
    else if (action.type === SET_INITIAL_STATE) {
        return innitialObject
    } else return state;
}

export const addBetToDBTC = (login: string, bets: Array<BetType>): BaseThunkActionType<ActionsTypes> => async (dispatch: any) => {
    dispatch(actions.toggleIsAddingBet(true))
    let response = await addBetsToDB(login, bets)
    if(response.resultCode === 0) {
        dispatch(actions.toggleIsAddingBet(false))
        dispatch(actions.addBetSuccess({
            bets: [],
            isAddingBetsToDB: false,
            addingBetsSuccess: true,
            message: response.message
        }))
    } else {
        dispatch(actions.toggleIsAddingBet(false))
        dispatch(actions.addBetError(response.message))
    }
}

export default betReducer;