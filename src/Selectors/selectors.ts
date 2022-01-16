import { AppStoreType } from '../redux/redux'
import { FullBetStatisticDataType } from '../redux/betStatisticReducer'
import { ChampionshipsPageDataType } from '../redux/championships_page_reducer'
import { MyPredictions, MyProfileBets } from '../redux/my_profile_reducer'
import { BetType } from '../redux/betReducer'
import { GameStatsDataType } from '../redux/game_stats_reducer'
import { BasicTotals, ChampionshipStatsDataType, BetStatisticType } from '../redux/championship_stats_reducer'
import { Championship, MyNetGameType } from "../redux/mainPageReducer";

export const error_handler_selectors = {
    get_error_message: (state: AppStoreType) => {
        return state.error_handler.error_message
    },
    get_warning_messages: (state: AppStoreType) => {
        return state.error_handler.warning_messages
    }
}

export const createNewUser_page_selectors = {
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.createNU.is_getting_data;
    },
    get_new_user_login: (state: AppStoreType): string | null => {
        return state.createNU.newUserLogin;
    },
    get_warning_message: (state: AppStoreType): string[] | null => {
        return state.createNU.warning_messages
    },
    get_operation_success: (state: AppStoreType): boolean | null => {
        return state.createNU.createNewUserSuccess;
    },
    get_defaultPhotoURL: (state: AppStoreType) => {
        return state.createNU.defaultPhotoURL
    },
    get_avatar_photo_url: (state: AppStoreType) => {
        return state.createNU.avatar_photo_file_url
    },
    get_is_loading_photo: (state: AppStoreType) => {
        return state.createNU.isLoadingPhoto
    }
}

export const auth_user_selectors = {
    get_login: (state: AppStoreType): string | null => {
        return state.authUser.login;
    },
    get_is_logging_user: (state: AppStoreType): boolean => {
        return state.authUser.isLoggingUser;
    },
    get_is_authorized: (state: AppStoreType): boolean => {
        return state.authUser.isAuthorized;
    },
    get_warning_message: (state: AppStoreType): string[] | null => {
        return state.authUser.warningMessage;
    }
}

export const added_bets_selectors = {
    get_data: (state: AppStoreType): BetType[] | [] => {
        return state.bets.bets;
    },
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.bets.isAddingBetsToDB
    },
    get_message: (state: AppStoreType): string[] | null => {
        return state.bets.warning_messages
    }
}

export const game_stats_selectors = {
    get_data: (state: AppStoreType): GameStatsDataType | null => {
        return state.gameStats.data;
    },
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.gameStats.isGettingData;
    },
}

export const championships_page_selectors = {
    get_data: (state: AppStoreType): ChampionshipsPageDataType => {
        return state.championshipsPage.data
    },
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.championshipsPage.isGettingData
    }
}

export const bet_statistic_page_selectors = {
    get_data: (state: AppStoreType): FullBetStatisticDataType => {
        return state.betsStatistic.data
    },
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.betsStatistic.isGettingData
    }
}

export const championship_page_selectors = {
    getChampionshipStats: (state: AppStoreType): ChampionshipStatsDataType | undefined => {
        return state.championshipPage.data?.championships_stats
    },
    get_championship_bet_statistic: (state: AppStoreType): BetStatisticType | undefined => {
        return state.championshipPage.data?.bet_statistic
    },
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.championshipPage.isGettingData
    },
    get_basic_totals: (state: AppStoreType): BasicTotals | undefined => {
        return state.championshipPage.data?.basic_totals
    },
    get_games: (state: AppStoreType): MyNetGameType[] | [] | undefined => {
        return state.championshipPage.data?.games
    },
    get_name_of_championship: (state: AppStoreType) => {
        return state.championshipPage.data?.name_of_championship
    },
    get_season: (state: AppStoreType) => {
        return state.championshipPage.data?.season
    },
    get_country_name: (state: AppStoreType) => state.championshipPage.data?.country_name
}

export const propfile_selectors = {
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.myProfileReducer.isGettingData
    },
    get_data: (state: AppStoreType): MyProfileBets => {
        return state.myProfileReducer.bets
    },
    getPreditions: (state: AppStoreType): MyPredictions => {
        return state.myProfileReducer.predictions
    },
    get_is_loading_profile_photo: (state: AppStoreType): boolean => {
        return state.myProfileReducer.isLoadingPhoto
    },
    get_profile_photo_url: (state: AppStoreType): string | null => {
        return state.myProfileReducer.photo_url
    },
    get_defaultPhotoURL: (state: AppStoreType): string | null => {
        return state.myProfileReducer.defaultPhotoURL
    }
}

export const mainPage_selectors = {
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.mainPageReducer.isGettingPrediction
    },
    get_data: (state: AppStoreType): Championship[] | null => {
        return state.mainPageReducer.data
    },
    selected_date_of_prediction: (state: AppStoreType): string => {
        return state.mainPageReducer.selected_date_of_prediction
    },
    get_date_of_prediction: (state: AppStoreType): string => {
        return state.mainPageReducer.date_of_prediction
    }
}

export const prediction_board_selectors = {
    get_is_getting_data: (state: AppStoreType) => state.prediction_board.is_getting_data,
    get_data: (state: AppStoreType) => state.prediction_board.data,
    get_new_predictions_number: (state: AppStoreType) => state.prediction_board.new_predictions,
    get_last_seen_prediction_id: (state: AppStoreType) => state.prediction_board.last_seen_prediction_id,
    all_predictions_recieved: (state: AppStoreType) => state.prediction_board.are_all_predictions_recieved,
    get_is_getting_more_prediction: (state: AppStoreType) => state.prediction_board.is_getting_more_prediction
}
