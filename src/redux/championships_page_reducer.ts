import { myNetAPI } from "../API/api";
import { PropertiesType, BaseThunkActionType } from "./redux"

const SET_CHAMPIONSHIPS_LIST = 'CHAMPIONSHIPS_PAGE_REDUCER/SET_CHAMPIONSHIPS_LIST'
const SET_INITIAL_STATE = 'CHAMPIONSHIPS_PAGE_REDUCER/SET_INITIAL_STATE'
const TOGGLE_IS_GETTING_DATA = 'CHAMPIONSHIPS_PAGE_REDUCER/TOGGLE_IS_GETTING_DATA'

export const actions = {
    set_championships_list: (data: ChampionshipsPageDataType) => ({type: SET_CHAMPIONSHIPS_LIST, data} as const),
    set_initial_state: () => ({type: SET_INITIAL_STATE} as const),
    toggle_is_getting_data: (isGettingData: boolean) => ({type: TOGGLE_IS_GETTING_DATA, isGettingData} as const)
}

export type ChampionshipListItem = {
    db_name: string
    name_of_championship: string
    country_name: string
}

export type ChampionshipsPageDataType = Array<ChampionshipListItem> | null

let innitialObject =  {
    isGettingData: true,
    data: null as ChampionshipsPageDataType
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

const championshipsPageReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
    if(action.type === SET_CHAMPIONSHIPS_LIST) {
        return {
            ...state,
            data: action.data
        }
    } else if(action.type === TOGGLE_IS_GETTING_DATA) {
        return {
            ...state,
            isGettingData: action.isGettingData
        }
    } else if(action.type === SET_INITIAL_STATE) {
        return innitialObject
    }else return state;
}

export const setChampionshipsListTC = (): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    dispatch(actions.toggle_is_getting_data(true))
    let response = await myNetAPI.getChampionshipsList()
    dispatch(actions.set_championships_list(response.data))
    dispatch(actions.toggle_is_getting_data(false))
}


export default championshipsPageReducer;