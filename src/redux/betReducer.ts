import { usersAPI } from "../API/api"
import { actions as error_handler_actions, SetWarningMessagesAction } from "./error_handler_reducer"
import { PropertiesType, BaseThunkActionType } from "./redux"
import { transform_date_for_UI } from "../CommonFunctions/typed_functions"
import { getTodayDate } from "../CommonFunctions/commonFunctions"
import { NewKindOfBet, OddTypeType } from "../config"

const addBet = 'BET_REDUCER/addBet'
const REMOVE_BET = 'BET_REDUCER/REMOVE_BET'
const TOGGLE_IS_ADDING_BET = 'BET_REDUCER/TOGGLE_IS_ADDING_BET'
const addBet_SUCCESS = 'BET_REDUCER/addBet_SUCCESS'
const addBet_ERROR = 'BET_REDUCER/addBet_ERROR'
const SET_INITIAL_STATE = 'BET_REDUCER/SET_INITIAL_STATE'

export type addBetActionType = ReturnType<typeof actions.addBet>
export type removeBetActionType = ReturnType<typeof actions.removeBet>
export type SetInitialBetReducerState = ReturnType<typeof actions.setInitialBetsReducerState>

export const actions = {
    removeBet: (bet: BetType) => ({ type: REMOVE_BET, bet } as const),
    addBet: (bet: BetType) => ({ type: addBet, bet } as const),
    toggleIsAddingBet: (isAddingBetsToDB: boolean) => ({ type: TOGGLE_IS_ADDING_BET, isAddingBetsToDB } as const),
    addBetSuccess: (object: typeof innitialObject) => ({ type: addBet_SUCCESS, object } as const),
    addBetError: (message: string[]) => ({ type: addBet_ERROR, message } as const),
    setInitialBetsReducerState: () => ({ type: SET_INITIAL_STATE } as const)
}

export type Book_bet_name_type = 'w1' | 'w2' | 'x1' | 'x2' | 'x' | '!x' | 'TO' | 'TU' | 'h1' | 'h2'

export type MarketType = 'totals' | 'main_outcomes' | 'double_chance' | 'handicaps'

export type BetType = {
    kind_of_bet: NewKindOfBet;
    home_team: string
    away_team: string
    db_name: string;
    market: MarketType;
    game_id: number
    date_of_match: string
    value: number | null
    odd_type: OddTypeType
    odd: number | null
    bet_size?: number
}

let innitialObject = {
    bets: [] as Array<BetType> | [],
    isAddingBetsToDB: false,
    addingBetsSuccess: null as boolean | null,
    warning_messages: null as string[] | null
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

let betReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    if (action.type === addBet) {
        return {
            ...state,
            bets: [...state.bets, action.bet],
            warning_messages: null,
            addingBetsSuccess: null
        }
    } else if (action.type === REMOVE_BET) {
        if (state.bets) {
            return {
                ...state,
                bets: state.bets.filter(bet => { return action.bet !== bet })
            }
        } else return state
    } else if (action.type === TOGGLE_IS_ADDING_BET) {
        return {
            ...state,
            isAddingBetsToDB: action.isAddingBetsToDB
        }
    } else if (action.type === addBet_SUCCESS) {
        return {
            ...state,
            ...action.object
        }
    } else if (action.type === addBet_ERROR) {
        return {
            ...state,
            isAddingBetsToDB: false,
            addingBetsSuccess: false,
            warning_messages: action.message
        }
    }
    else if (action.type === SET_INITIAL_STATE) {
        return innitialObject
    } else return state;
}

export const addBetToDBTC = (login: string | null, bets: Array<BetType>): BaseThunkActionType<ActionsTypes | SetWarningMessagesAction> => async (dispatch) => {
    if (login) {
        dispatch(actions.toggleIsAddingBet(true))
        let response = await usersAPI.addBet(bets)
        if (response.data.resultCode === 0) {
            dispatch(actions.toggleIsAddingBet(false))
            dispatch(actions.addBetSuccess({
                bets: [],
                isAddingBetsToDB: false,
                addingBetsSuccess: true,
                warning_messages: ['Your bet has been placed']
            }))
        } else {
            dispatch(actions.toggleIsAddingBet(false))
            dispatch(actions.addBetError(response.data.error_messages))
        }
    } else {
        dispatch(error_handler_actions.set_warning([`You are not logged in`]))
    }
}

export const selectBetTC = (bet: BetType): BaseThunkActionType<ActionsTypes | SetWarningMessagesAction> => async (dispatch) => {
    // проверяем, есть ли в массиве bets объект с таким же маркетом, если есть получаем его
    const today = getTodayDate()
    if (bet.odd) {
        if (bet.date_of_match > today) {
            dispatch(actions.setInitialBetsReducerState())
            dispatch(actions.addBet(bet))

            //КОД С ЛОГИКОЙ ДЛЯ ДОБАВЛЕНИЯ НЕСКОЛЬКИХ СТАВОК В МАССИВ BETS

            // const bets = getState().bets.bets
            // const bet_with_same_market = bets.filter(bet_from_state => filterAddedBetsArray(bet, bet_from_state.game_id, bet_from_state.kind_of_bet, bet_from_state.market))
            // if (bet_with_same_market.length) {
            //     if (bet.odd_type === bet_with_same_market[0].odd_type) {
            //         dispatch(actions.removeBet(bet_with_same_market[0]))
            //     } else {
            //         dispatch(actions.removeBet(bet_with_same_market[0]))
            //         dispatch(actions.addBet(bet))
            //     }
            // } else {
            //     dispatch(actions.addBet(bet))
            // }
        } else {
            dispatch(error_handler_actions.set_warning([`All bets on ${transform_date_for_UI(new Date(bet.date_of_match))} are made`]))
        }
    }
}

export default betReducer;