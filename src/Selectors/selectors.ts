import { getTodayDate } from "../CommonFunctions/commonFunctions";
import {AppStoreType} from '../redux/redux'
import { FullBetStatisticDataType } from '../redux/bet_statistic_reducer'
import { ChampionshipsPageDataType } from '../redux/championships_page_reducer'
import { MyProfileDataType } from '../redux/my_profile_reducer'
import { BetType } from '../redux/betReducer'
import {GameStatsDataType} from '../redux/game_stats_reducer'
import {MainPageChampionshipDataType} from '../redux/championshipsReduser'
import {BasicTotals, ChampionshipStatsDataType, BetStatisticType} from '../redux/championship_stats_reducer'
import { MyNetChampionship } from "../redux/my_net_main_page_reducer";

export const getBasicTotals = (state: AppStoreType): BasicTotals | undefined => {
    return state.championshipPage.data?.basic_totals
}

export const getIsCreatingUser = (state: AppStoreType): boolean => {
    return state.createNU.isCreatingUser;
}

export const getNULogin = (state: AppStoreType): string | null => {
    return state.createNU.newUserLogin;
}

export const getCNUwarningMessage = (state: AppStoreType): string | null => {
    return state.createNU.createNUwarningMessage;
}

export const getCNUsuccess = (state: AppStoreType): boolean | null => {
    return state.createNU.createNewUserSuccess;
}

export const getLoginOfLU = (state: AppStoreType): string | null => {
    return state.authUser.login;
}

export const getIsLoggingUser = (state: AppStoreType): boolean => {
    return state.authUser.isLoggingUser;
}

export const getIsAuthorizedLU = (state: AppStoreType): boolean => {
    return state.authUser.isAuthorized;
}

export const getLUwarningMessage = (state: AppStoreType): string | null => {
    return state.authUser.warningMessage;
}

export const getIsGettingPrediction = (state: AppStoreType): boolean => {
    return state.championships.isGettingPrediction;
}

export const getLoadedPredictions = (state: AppStoreType): MainPageChampionshipDataType[] | null => {
    return state.championships.predictions;
}

export const getDateOfPrediction = (state: AppStoreType): string => {
    return state.championships.date_of_prediction || getTodayDate(); 
}

export const getGameStatsData = (state: AppStoreType): GameStatsDataType | null => {
    return state.gameStats.data;
}

export const getIsGettingGameStatsData = (state: AppStoreType): boolean => {
    return state.gameStats.isGettingData;
}

export const getAddedBets = (state: AppStoreType): BetType[] | [] => {
    return state.bets.bets;
}
export const getIsAddingBetToDB = (state: AppStoreType): boolean => {
    return state.bets.isAddingBetsToDB
}

export const getMessageFromBetReducer = (state: AppStoreType): string | null => {
    return state.bets.message
}

export const getSelectedDateOfPrediction = (state: AppStoreType) => {
    return state.championships.selected_date_of_prediction
}

export const getChampionshipStats = (state: AppStoreType): ChampionshipStatsDataType | undefined => {
    return state.championshipPage.data?.championships_stats
}

export const getChampionshipBetStatistic = (state: AppStoreType): BetStatisticType | undefined => {
    return state.championshipPage.data?.bet_statistic
}

export const getFullBetStatisticFromState = (state: AppStoreType): FullBetStatisticDataType => {
    return state.betsStatistic.data
}

export const getDataForChampionshipsPage = (state: AppStoreType): ChampionshipsPageDataType => {
    return state.championshipsPage.data
}

export const getMyProfileData = (state: AppStoreType): MyProfileDataType => {
    return state.myProfileReducer.data
}

export const getIsGettingChampionshipPageData = (state: AppStoreType): boolean => {
    return state.championshipPage.isGettingData
}

export const getIsGettingBetsStatisticData = (state: AppStoreType): boolean => {
    return state.betsStatistic.isGettingData
}

export const getIsGettingMyProfileData = (state: AppStoreType): boolean => {
    return state.myProfileReducer.isGettingData
}

export const getGamesDataForChampionshipPage = (state: AppStoreType): any => {
    return state.championshipPage.data?.games
}

export const getProfilePhotoUrl = (state: AppStoreType): string | null => {
    return state.myProfileReducer.photo_url
}

export const getIsLoadingProfilePhoto = (state: AppStoreType): boolean => {
    return state.myProfileReducer.isLoadingPhoto
}

export const my_net_main_page_selectors = {
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.my_net_main_page_reducer.isGettingPrediction
    },
    get_data: (state: AppStoreType): MyNetChampionship[] | null => {
        return state.my_net_main_page_reducer.data
    },
    selected_date_of_prediction: (state: AppStoreType) => {
        return state.my_net_main_page_reducer.selected_date_of_prediction
    }
}
