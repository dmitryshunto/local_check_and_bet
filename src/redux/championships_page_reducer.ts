import { getChampionshipsList } from "../API/api";
import { PropertiesType, BaseThunkActionType } from "./redux"

const SET_CHAMPIONSHIPS_LIST = 'CHAMPIONSHIPS_PAGE_REDUCER/SET_CHAMPIONSHIPS_LIST'
const TOGGLE_IS_GETTING_DATA = 'CHAMPIONSHIPS_PAGE_REDUCER/TOGGLE_IS_GETTING_DATA'

const actions = {
    set_championships_list: (object: innitialObjectType) => ({type: SET_CHAMPIONSHIPS_LIST, object} as const),
    toggle_is_getting_data: (object: boolean) => ({type: TOGGLE_IS_GETTING_DATA, isGettingData: object} as const)
}

export type ChampionshipsPageDataType = Array<string> | null

type innitialObjectType = {
    isGettingData: boolean
    data: ChampionshipsPageDataType
}

let innitialObject: innitialObjectType =  {
    isGettingData: false,
    data: null
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

const championshipsPageReducer = (state = innitialObject, action: ActionsTypes) => {
    if(action.type === SET_CHAMPIONSHIPS_LIST) {
        return {
            ...state,
            ...action.object
        }
    } else if(action.type === TOGGLE_IS_GETTING_DATA) {
        return {
            ...state,
            isGettingData: action.isGettingData
        }
    } else return state;
}

export const setChampionshipsListTC = (): BaseThunkActionType<ActionsTypes> => async (dispatch: any) => {
    dispatch(actions.toggle_is_getting_data(true))
    let response = await getChampionshipsList()
    dispatch(actions.set_championships_list({ data: response.data,
                                              isGettingData: false}))
}


export default championshipsPageReducer;