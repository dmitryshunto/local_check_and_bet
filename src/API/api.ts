import axios from 'axios';
import { BetType, OddTypeType } from '../redux/betReducer'
import { AuthorizeType, BaseAPIType, ServerResponseType } from './api_types'
import { FullBetStatisticItemType } from '../redux/bet_statistic_reducer'
import { ChampionshipDataType } from '../redux/championship_stats_reducer'
import { GameStatsDataType } from '../redux/game_stats_reducer'
import { MainPageChampionshipDataType } from '../redux/championshipsReduser'
import { MyNetChampionship } from '../redux/my_net_main_page_reducer';
import { ChampionshipsPageDataType } from '../redux/championships_page_reducer';
import { UserDataType } from '../redux/my_profile_reducer';
import { NewKindOfBet } from '../redux/redux';

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
    },
    get_full_bet_statistic: async (db_name: string, kind_of_bet: NewKindOfBet, type_of_bet: OddTypeType) => {
        let response = await my_net_axios_instanse.get<ServerResponseType<FullBetStatisticItemType[]>>(`full_bet_info/${db_name}/${kind_of_bet}/${type_of_bet}`)
        return response.data
    }
}

export const users_api = {
    am_i_authorized: async () => {
        let response = await my_net_axios_instanse.get<AuthorizeType>(`users/am_i_authorized`)
        return response
    },
    login_user: async (user_login: string, user_password: string) => {
        return await my_net_axios_instanse.post(`users/login_user`, { user_login, user_password })
    },
    logout_user: async () => {
        return await my_net_axios_instanse.get(`users/logout_user`)
    },
    create_new_user: async (user_login: string, user_password: string) => {
        return await my_net_axios_instanse.post<AuthorizeType>(`users/create_new_user`, { user_login, user_password })
    },
    get_create_new_user_page_info: async () => {
        const response = await my_net_axios_instanse.get<ServerResponseType<{ default_photo_url: string }>>(`users/create_new_user_page`)
        return response.data
    },
    add_bet: async (bets: BetType[]) => {
        return await my_net_axios_instanse.post<BaseAPIType>(`users/add_bet`, { bets })
    },
    get_my_profile: async () => {
        const response = await my_net_axios_instanse.get<ServerResponseType<UserDataType>>(`users/get_my_profile`)
        return response.data
    },
    upload_profile_avatar: async (photo_file: File | Blob) => {
        const formData = new FormData()
        formData.append('avatar', photo_file)
        const response = await my_net_axios_instanse.post<ServerResponseType<string | null>>(`users/upload_profile_avatar`, formData)
        return response.data
    }
}

export const get_blob_file =  async (blob_url: string) => {
    const response = await axios({
        method: 'get',
        url: blob_url,
        responseType: 'blob'
    })
    var reader = new FileReader();
    reader.readAsDataURL(response.data)
    reader.onloadend = () => {
        let base64data = reader.result;
        return base64data
    }
    return reader.result
}

export const getPredictions = async (date_of_prediction: string) => {
    let response = await instanse.post<ServerResponseType<MainPageChampionshipDataType[] | null>>(`mainpage.php`, { date_of_prediction });
    return response.data;
}
