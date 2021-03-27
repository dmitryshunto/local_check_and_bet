import axios from 'axios';
import { BetType } from '../redux/betReducer'
import {AuthorizeType, BaseAPIType, UserDataType, ServerResponseType} from './api_types'
import {FullBetStatisticItemType} from '../redux/bet_statistic_reducer'
import { ChampionshipDataType } from '../redux/championship_stats_reducer'
import {GameStatsDataType} from '../redux/game_stats_reducer'
import {MainPageChampionshipDataType} from '../redux/championshipsReduser'
import { MyNetChampionship } from '../redux/my_net_main_page_reducer';
import { ChampionshipsPageDataType } from '../redux/championships_page_reducer';

let instanse = axios.create({
    baseURL: 'http://localhost/',
    withCredentials: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

const my_net_axios_instanse = axios.create({
    baseURL: 'http://localhost:3001/',
    withCredentials: true
})

export const my_net_api = {
    get_predictions: async (date_of_prediction: string) => {
        let url = date_of_prediction ? `${date_of_prediction}/` : ''
        let response = await my_net_axios_instanse.get<ServerResponseType<MyNetChampionship[] | []>>(`my_net_main_page/${url}`)
        return response.data
    },
    get_game_stats: async (db_name: string, game_id: number) => {
        let response = await my_net_axios_instanse.get<ServerResponseType<GameStatsDataType>>(`game_stats/${db_name}/${game_id}`)
        return response.data
    },
    get_championship_stats: async (db_name: string) => {
        let response = await my_net_axios_instanse.get<ServerResponseType<ChampionshipDataType>>(`championship_stats/${db_name}`)
        return response.data
    },
    get_championships_list: async () => {
        let response = await my_net_axios_instanse.get<ServerResponseType<ChampionshipsPageDataType>>(`championships_list_page`)
        return response.data
    }
}

export const users_api = {
    am_i_authorized: async () => {
        let response = await my_net_axios_instanse.get<AuthorizeType>(`users/am_i_authorized`)
        return response
    },
    login_user: async (user_login: string, user_password: string) => {
        return await my_net_axios_instanse.post(`users/login_user`, {user_login, user_password})
    },
    logout_user: async () => {
        return await my_net_axios_instanse.get(`users/logout_user`)
    },
    create_new_user: async (user_login: string, user_password: string) => {
        return await my_net_axios_instanse.post<AuthorizeType>(`users/create_new_user`, {user_login, user_password})
    },
    add_bet: async (bets: BetType[]) => {
        return await my_net_axios_instanse.post<BaseAPIType>(`users/add_bet`, {bets})
    }   
}

export const amIAuthorized = () => {
    return instanse.get<AuthorizeType>(`authuser.php`);
} 

export const createNewUser = (login: string, password: string) => {
    return instanse.post<AuthorizeType>(`createnewuser.php`, {login, password});
}

export const getPredictions = async (date_of_prediction: string) => {
    let response = await instanse.post<ServerResponseType<MainPageChampionshipDataType[] | null>>(`mainpage.php`, {date_of_prediction});
    return response.data;
}

export const getGameStats = async (name_of_championship: string, games_id: number) => {
    let response = await instanse.get<ServerResponseType<GameStatsDataType>>(`game_stats.php?name_of_championship=${name_of_championship}&games_id=${games_id}`)
    return response.data;
}

export const addBetsToDB = async (user_login: string, bets: Array<BetType>) => {
    let response = await instanse.post<BaseAPIType>(`add_bet.php`, {user_login, bets});
    return response.data;
}

export const getInfoAboutChampionShip = async (name_of_championship: string) => {
    let response = await instanse.get<ServerResponseType<ChampionshipDataType>>(`championship_stats.php?name_of_championship=${name_of_championship}`)
    return response.data
}

export const getFullBetStatistic = async (name_of_championship: string, kind_of_bet: string, type_of_bet: string) => {
    let response = await instanse.get<ServerResponseType<FullBetStatisticItemType[]>>(`bets_statistic.php?name_of_championship=${name_of_championship}&kind_of_bet=${kind_of_bet}&type_of_bet=${type_of_bet}`)
    return response.data
}

export const getChampionshipsList = async () => {
    let response = await instanse.get<ServerResponseType<string[]>>('championships_page.php')
    return response.data
}

export const getUserData = async (user_login: string) => {
    let response = await instanse.post<UserDataType>(`my_profile.php`, {user_login});
    return response.data;
}

export const uploadProfilePhoto = async (photo_file: File) => {
    const formData = new FormData()
    formData.append('profile_photo', photo_file)
    const response = await instanse.post<ServerResponseType<string | null>>(`upload_photo.php`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}