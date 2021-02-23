import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { setBetStatisticTC } from '../../../../../redux/bet_statistic_reducer';
import { AppStoreType } from '../../../../../redux/redux'
import { connect } from 'react-redux';
import { bet_statistic_page_selectors } from '../../../../../Selectors/selectors'
import BetStatisticTable from './BetStatisticTable/BetStatisticTable';
import { FullBetStatisticDataType } from '../../../../../redux/bet_statistic_reducer'
import classes from "./BetStatisticPage.module.css"
import { translate_kind_of_bet_and_home_away } from '../../../../../CommonFunctions/commonFunctions';
import { PreloaderPageWithoutHeader } from './../../../../CommonComponents/PreloaderPage/PreloaderPage';

type RoutePropsType = RouteComponentProps<{name_of_championship: string, kind_of_bet: string, type_of_bet: string}>

const BetStatisticPage = ({data, setBetStatisticTC, isGettingData, match}: PropsType) => {
    useEffect(() => {
        setBetStatisticTC(match.params.name_of_championship, match.params.kind_of_bet, match.params.type_of_bet)
    }, [match.params.name_of_championship, match.params.kind_of_bet, match.params.type_of_bet])
    if(isGettingData) return <PreloaderPageWithoutHeader/>
    return (
        <div className = {classes.bet_statistic_page}>
            <div className = {classes.page_head}>
                Статистика ставок на {translate_kind_of_bet_and_home_away(match.params.type_of_bet)} на 
                {' ' + translate_kind_of_bet_and_home_away(match.params.kind_of_bet)?.toLowerCase()}
            </div>
            <BetStatisticTable data = {data} />
        </div>
    )
}

type MapStatePropsType = {
    data: FullBetStatisticDataType
    isGettingData: boolean
}

type MapDispatchPropsType = {
    setBetStatisticTC: (name_of_championship: string, kind_of_bet: string, type_of_bet: string) => any
}

type OwnPropsType = {
   
}

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType & RoutePropsType

let mapStateToProps = (state: AppStoreType): MapStatePropsType => {
    return {
       data: bet_statistic_page_selectors.get_data(state),
       isGettingData: bet_statistic_page_selectors.get_is_getting_data(state)
    }
}

let mapDispatchToProps: MapDispatchPropsType = {
    setBetStatisticTC     
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(BetStatisticPage)