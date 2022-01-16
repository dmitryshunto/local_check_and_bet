import React from 'react';
import { connect, useSelector } from 'react-redux';
import { setChampionshipStatsTC, ChampionshipStatsDataType, BetStatisticType, BasicTotals,
         actions } from '../../../redux/championship_stats_reducer';
import {AppStoreType} from '../../../redux/redux'
import { added_bets_selectors, championship_page_selectors } from '../../../Selectors/selectors';
import { RouteComponentProps } from "react-router-dom"
import classes from './ChampionshipPage.module.css'
import ChampionshipBetsTable from './ChampionshipBetsTable/ChampionshipBetsTable'
import { PreloaderPageWithoutHeader } from '../../CommonComponents/PreloaderPage/PreloaderPage';
import { useSubscribeOnData } from '../../../Hooks/Hooks';
import GamesTable from './GamesTable/GamesTable';
import { BetType, selectBetTC } from '../../../redux/betReducer';
import BetCoupon from '../../CommonComponents/BetCoupon/BetCoupon';
import { useEffect } from 'react';
import { MyNetGameType } from '../../../redux/mainPageReducer';
import ChampionshipStats from './ChampionshipStats/ChampionshipStats';


const ChampionshipPageContainer: React.FC<PropsType> = (props) => {
    const country_name = useSelector(championship_page_selectors.get_country_name)
    const name_of_championship = useSelector(championship_page_selectors.get_name_of_championship)
    useEffect(() => {
        if (country_name && name_of_championship) document.title = `${country_name} ${name_of_championship}`.toUpperCase()
        return () => {document.title = 'Check and Bet'}}, [country_name, name_of_championship])
    useSubscribeOnData(props.setChampionshipStatsTC, props.set_championship_page_initial_state, [props.match.params.db_name])
    if(props.isGettingData) return <PreloaderPageWithoutHeader />
    const new_props: PropsType = {
        ...props,
        country_name, name_of_championship
    }
    return <ChampionshipPage {...new_props} />
}

let ChampionshipPage: React.FC<PropsType> =  ({championship_stats, bet_statistic, basic_totals, games, match, ...props}) => {
    const season = useSelector(championship_page_selectors.get_season)
    return (
        <div className = {classes.championship_page}>
            <h2>{`${props.country_name?.toUpperCase()} ${props.name_of_championship?.toUpperCase()} ${season}`}</h2>
            <ChampionshipStats championship_stats = {championship_stats!}
                               name_of_championship =  {match.params.db_name}
                               basic_totals = {basic_totals!}/>
            <ChampionshipBetsTable bet_statistic = {bet_statistic!}/>
            <GamesTable games = {games}
                        db_name = {match.params.db_name}
                        bets = {props.bets}
                        selectBetTC = {props.selectBetTC}
                        country_and_name_of_championship = {`${props.country_name} ${props.name_of_championship}`}
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
    games: MyNetGameType[] | [] | undefined
    bets: [] | BetType[]
}

type MapDispatchPropsType = {
    setChampionshipStatsTC: (name_of_championship: string) => void
    selectBetTC: (bet: BetType) => void
    set_championship_page_initial_state: () => void
}

type OwnPropsType = {
   country_name: string | undefined
   name_of_championship: string | undefined
}

type RoutePropsType = RouteComponentProps<{db_name: string}>

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType & RoutePropsType

let mapStateToProps = (state: AppStoreType): MapStatePropsType => {
    return {
        championship_stats: championship_page_selectors.getChampionshipStats(state),
        bet_statistic: championship_page_selectors.get_championship_bet_statistic(state),
        isGettingData: championship_page_selectors.get_is_getting_data(state),
        basic_totals: championship_page_selectors.get_basic_totals(state),
        games: championship_page_selectors.get_games(state),
        bets: added_bets_selectors.get_data(state)       
    }
}

let mapDispatchToProps: MapDispatchPropsType = {
    setChampionshipStatsTC,
    selectBetTC, 
    set_championship_page_initial_state: actions.set_championship_page_initial_state
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(ChampionshipPageContainer)