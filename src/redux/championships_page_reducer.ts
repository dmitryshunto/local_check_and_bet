import { getChampionshipsList, my_net_api } from "../API/api";
import { PropertiesType, BaseThunkActionType } from "./redux"

const SET_CHAMPIONSHIPS_LIST = 'CHAMPIONSHIPS_PAGE_REDUCER/SET_CHAMPIONSHIPS_LIST'
const TOGGLE_IS_GETTING_DATA = 'CHAMPIONSHIPS_PAGE_REDUCER/TOGGLE_IS_GETTING_DATA'

const actions = {
    set_championships_list: (object: typeof innitialObject) => ({type: SET_CHAMPIONSHIPS_LIST, object} as const),
    toggle_is_getting_data: (object: boolean) => ({type: TOGGLE_IS_GETTING_DATA, isGettingData: object} as const)
}

export type ChampionshipListItem = {
    db_name: string
    name_of_championship: string
    country_name: string
}

export type ChampionshipsPageDataType = Array<ChampionshipListItem> | null

let innitialObject =  {
    isGettingData: false,
    data: null as ChampionshipsPageDataType
};

type ActionsTypes = ReturnType<PropertiesType<typeof actions>>

const championshipsPageReducer = (state = innitialObject, action: ActionsTypes): typeof innitialObject => {
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

export const setChampionshipsListTC = (): BaseThunkActionType<ActionsTypes> => async (dispatch) => {
    dispatch(actions.toggle_is_getting_data(true))
    let response = await my_net_api.get_championships_list()
    dispatch(actions.set_championships_list({ data: response.data,
                                              isGettingData: false}))
}


export default championshipsPageReducer;