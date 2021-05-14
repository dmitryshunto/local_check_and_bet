import { reducer as formReducer } from 'redux-form'
import { createStore, combineReducers, applyMiddleware, compose, Action} from "redux";
import thunkMiddleWare, {ThunkAction} from "redux-thunk";
import authReducer from './authReducer';
import createNUReducer from './createNUReducer';
import gameStatsReducer from './game_stats_reducer';
import betReducer from './betReducer';
import championshipStatsReducer from './championship_stats_reducer';
import betStatisticReducer from './bet_statistic_reducer';
import championshipsPageReducer from './championships_page_reducer';
import myProfileReducer from './my_profile_reducer';
import my_net_main_page_reducer from './my_net_main_page_reducer'
import error_handler_reducer from './error_handler_reducer';

let rootReducer = combineReducers({
    form: formReducer,
    authUser: authReducer,
    createNU: createNUReducer,
    gameStats: gameStatsReducer,
    bets: betReducer,
    championshipPage: championshipStatsReducer,
    betsStatistic: betStatisticReducer,
    championshipsPage: championshipsPageReducer,
    myProfileReducer: myProfileReducer,
    my_net_main_page_reducer: my_net_main_page_reducer,
    error_handler: error_handler_reducer
})

type RootReducerType = typeof rootReducer
export type AppStoreType = ReturnType<RootReducerType>
export type PropertiesType<T> = T extends {[key: string]: infer U} ? U : never
export type BaseThunkActionType<A extends Action> = ThunkAction<Promise<void>, AppStoreType, unknown, A>

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export type KindOfBetType = 'goals' | 'ycard' | 'corners'
export type NewKindOfBet = 'goals' | 'corners' | 'yellow_cards' | 'fouls' | 'shots_on_goal'
export type KindsOfBetType = KindOfBetType[]
export type NewKindsOfBet = NewKindOfBet[]
export type HomeAwayItemsType = 'home' | 'away'

let store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleWare)));

export default store;