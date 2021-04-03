import { getTodayDate } from "../CommonFunctions/commonFunctions";
import { AppStoreType } from '../redux/redux'
import { FullBetStatisticDataType } from '../redux/bet_statistic_reducer'
import { ChampionshipsPageDataType } from '../redux/championships_page_reducer'
import { MyProfileBets } from '../redux/my_profile_reducer'
import { BetType } from '../redux/betReducer'
import { GameStatsDataType } from '../redux/game_stats_reducer'
import { MainPageChampionshipDataType, MainPageGameDataType } from '../redux/championshipsReduser'
import { BasicTotals, ChampionshipStatsDataType, BetStatisticType } from '../redux/championship_stats_reducer'
import { MyNetChampionship, MyNetGameType } from "../redux/my_net_main_page_reducer";

export const error_handler_selectors = {
    get_error_message: (state: AppStoreType) => {
        return state.error_handler.error_message
    },
    get_warning_messages: (state: AppStoreType) => {
        return state.error_handler.warning_messages
    }
}

export const create_new_user_page_selectors = {
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
    get_default_photo_url: (state: AppStoreType) => {
        return state.createNU.default_photo_url
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

export const main_page_selectors = {
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.championships.isGettingPrediction;
    },
    get_data: (state: AppStoreType): MainPageChampionshipDataType[] | null => {
        return state.championships.predictions;
    },
    get_date_of_prediction: (state: AppStoreType): string => {
        return state.championships.date_of_prediction || getTodayDate();
    },
    get_selected_date_of_prediction: (state: AppStoreType) => {
        return state.championships.selected_date_of_prediction
    }
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
    get_championship_stats: (state: AppStoreType): ChampionshipStatsDataType | undefined => {
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
    }
}

export const propfile_selectors = {
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.myProfileReducer.isGettingData
    },
    get_data: (state: AppStoreType): MyProfileBets => {
        return state.myProfileReducer.bets
    },
    get_is_loading_profile_photo: (state: AppStoreType): boolean => {
        return state.myProfileReducer.isLoadingPhoto
    },
    get_profile_photo_url: (state: AppStoreType): string | null => {
        return state.myProfileReducer.photo_url
    },
    get_default_photo_url: (state: AppStoreType): string | null => {
        return state.myProfileReducer.default_photo_url
    }
}

export const my_net_main_page_selectors = {
    get_is_getting_data: (state: AppStoreType): boolean => {
        return state.my_net_main_page_reducer.isGettingPrediction
    },
    get_data: (state: AppStoreType): MyNetChampionship[] | null => {
        return state.my_net_main_page_reducer.data
    },
    selected_date_of_prediction: (state: AppStoreType): string => {
        return state.my_net_main_page_reducer.selected_date_of_prediction
    },
    get_date_of_prediction: (state: AppStoreType): string => {
        return state.my_net_main_page_reducer.date_of_prediction
    }
}
