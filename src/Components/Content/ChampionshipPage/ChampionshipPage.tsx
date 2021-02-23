import React from 'react';
import { connect } from 'react-redux';
import { setChampionshipStatsTC, ChampionshipStatsDataType, BetStatisticType, BasicTotals,
         actions } from '../../../redux/championship_stats_reducer';
import {AppStoreType} from '../../../redux/redux'
import ChampionshipStats from './ChampionshipStats/ChampionshipStats';
import { added_bets_selectors, championship_page_selectors } from '../../../Selectors/selectors';
import { RouteComponentProps } from "react-router-dom"
import classes from './ChampionshipPage.module.css'
import ChampionshipBetsTable from './ChampionshipBetsTable/ChampionshipBetsTable';
import { isEmpty } from './../../../CommonFunctions/commonFunctions';
import { PreloaderPageWithoutHeader } from '../../CommonComponents/PreloaderPage/PreloaderPage';
import { useSubscribeOnData } from '../../../Hooks/Hooks';
import GamesTable from './GamesTable/GamesTable';
import { BetType, addBetActionType, removeBetActionType, actions as betReducerActions } from '../../../redux/betReducer';
import BetCoupon from '../../CommonComponents/BetCoupon/BetCoupon';
import { useEffect } from 'react';
import { MainPageGameDataType } from '../../../redux/championshipsReduser';

const ChampionshipPageContainer: React.FC<PropsType> = (props) => {
    useEffect(() => {
        document.title = props.match.params.name_of_championship.toUpperCase()
        return () => {document.title = 'Check and Bet'}}, [props.match.params.name_of_championship])
    useSubscribeOnData(props.setChampionshipStatsTC, props.set_championship_page_initial_state, [props.match.params.name_of_championship])
    if(isEmpty(props.championship_stats) || isEmpty(props.bet_statistic) || props.isGettingData) return <PreloaderPageWithoutHeader />
    return <ChampionshipPage {...props}/>
}

let ChampionshipPage: React.FC<PropsType> =  ({championship_stats, bet_statistic, basic_totals, games, match, ...props}) => {
    return (
        <div className = {classes.championship_page}>
            <ChampionshipStats championship_stats = {championship_stats!}
                               name_of_championship =  {match.params.name_of_championship}
                               basic_totals = {basic_totals!}/>
            <ChampionshipBetsTable bet_statistic = {bet_statistic!}/>
            <GamesTable games = {games}
                        basic_totals = {basic_totals!}
                        name_of_championship =  {match.params.name_of_championship}
                        addedBets={props.bets}
                        addBet={props.addBet}
                        removeBet={props.removeBet}
                        />
            <BetCoupon />
        </div>
    )
}

type MapStatePropsType = {
    championship_stats: ChampionshipStatsDataType | undefined
    bet_statistic: BetStatisticType | undefined
    isGettingData: boolean
    basic_totals: BasicTotals | undefined
    games: MainPageGameDataType[] | [] | undefined
    bets: BetType[] | []
}

type MapDispatchPropsType = {
    setChampionshipStatsTC: (name_of_championship: string) => void
    set_championship_page_initial_state: () => void
    addBet: (bet: BetType) => addBetActionType
    removeBet: (bet: BetType) => removeBetActionType
}

type OwnPropsType = {
   
}

type RoutePropsType = RouteComponentProps<{name_of_championship: string}>

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType & RoutePropsType

let mapStateToProps = (state: AppStoreType): MapStatePropsType => {
    return {
        championship_stats: championship_page_selectors.get_championship_stats(state),
        bet_statistic: championship_page_selectors.get_championship_bet_statistic(state),
        isGettingData: championship_page_selectors.get_is_getting_data(state),
        basic_totals: championship_page_selectors.get_basic_totals(state),
        games: championship_page_selectors.get_games(state),
        bets: added_bets_selectors.get_data(state)        
    }
}

let mapDispatchToProps: MapDispatchPropsType = {
    setChampionshipStatsTC, 
    set_championship_page_initial_state: actions.set_championship_page_initial_state,
    addBet: betReducerActions.addBet,
    removeBet: betReducerActions.removeBet
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(ChampionshipPageContainer)