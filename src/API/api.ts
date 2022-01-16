import axios from 'axios';
import { BetType } from '../redux/betReducer'
import { AuthData, AuthorizeType, BaseAPIType, ServerResponseType } from './api_types'
import { FullBetStatisticItemType } from '../redux/betStatisticReducer'
import { ChampionshipDataType } from '../redux/championship_stats_reducer'
import { GameStatsDataType } from '../redux/game_stats_reducer'
import { Championship } from '../redux/mainPageReducer';
import { ChampionshipsPageDataType } from '../redux/championships_page_reducer';
import { UserDataType } from '../redux/my_profile_reducer';
import { base_url, NewKindOfBet, OddTypeType } from './../config';
import { PredictionType } from '../redux/prediction_board';

const axiosInstanse = axios.create({
    baseURL: base_url,
    withCredentials: true
})

export const myNetAPI = {
    getPreditions: async (dateOfPrediction: string) => {
        let url = dateOfPrediction ? `${dateOfPrediction}/` : ''
        let response = await axiosInstanse.get<ServerResponseType<Championship[] | []>>(`mainPage/${url}`)
        return response.data
    },
    getGameStats: async (dbName: string, gameID: number) => {
        let response = await axiosInstanse.get<ServerResponseType<GameStatsDataType>>(`game_stats/${dbName}/${gameID}`)
        return response.data
    },
    getChampionshipStats: async (dbName: string) => {
        let response = await axiosInstanse.get<ServerResponseType<ChampionshipDataType>>(`championshipStats/${dbName}`)
        return response.data
    },
    getChampionshipsList: async () => {
        let response = await axiosInstanse.get<ServerResponseType<ChampionshipsPageDataType>>(`championshipsListPage`)
        return response.data
    },
    getFullBetStatistic: async (dbName: string, kindOfBet: NewKindOfBet, typeOfBet: OddTypeType) => {
        let response = await axiosInstanse.get<ServerResponseType<FullBetStatisticItemType[]>>(`fullBetInfo/${dbName}/${kindOfBet}/${typeOfBet}`)
            return response.data
    }
}

export const usersAPI = {
    amIAuthorized: async () => {
        let response = await axiosInstanse.get<ServerResponseType<AuthData>>(`users/amIAuthorized`)
        return response
    },
    loginUser: async (userLogin: string, userPassword: string) => {
        return await axiosInstanse.post(`users/loginUser`, { userLogin, userPassword })
    },
    logoutUser: async () => {
        return await axiosInstanse.get(`users/logoutUser`)
    },
    createNewUser: async (userLogin: string, userPassword: string) => {
        return await axiosInstanse.post<AuthorizeType>(`users/createNewUser`, { userLogin, userPassword })
    },
    getCreateNewUserPageInfo: async () => {
        const response = await axiosInstanse.get<ServerResponseType<{ defaultPhotoURL: string }>>(`users/createNewUserPage`)
        return response.data
    },
    addBet: async (bets: BetType[]) => {
        return await axiosInstanse.post<BaseAPIType>(`users/addBet`, { bets })
    },
    getMyProfile: async () => {
        const response = await axiosInstanse.get<ServerResponseType<UserDataType>>(`users/getMyProfile`)
        return response.data
    },
    uploadProfileAvatar: async (photoFile: File | Blob) => {
        const formData = new FormData()
        formData.append('avatar', photoFile)
        const response = await axiosInstanse.post<ServerResponseType<string | null>>(`users/uploadProfileAvatar`, formData)
        return response.data
    },
    addPrediction: async (prediction: PredictionType) => {
        const response = await axiosInstanse.post<BaseAPIType>(`users/addPrediction`, {prediction})
        return response.data
    },
    getPublicPredictions: async (portionSize: number, lastID?: number) => {
        const response = await axiosInstanse.post<ServerResponseType<PredictionType[]>>('users/getPublicPredictions', {portionSize, lastID})
        return response.data
    },
    updateUserLastSeenPredictionID: async (predictionID: number) => {
        await axiosInstanse.post<BaseAPIType>(`users/updateUserLastSeenPredictionID`, {predictionID})
    } 
}

export const getBlobFile =  async (blobURL: string) => {
    const response = await axios({
        method: 'get',
        url: blobURL,
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