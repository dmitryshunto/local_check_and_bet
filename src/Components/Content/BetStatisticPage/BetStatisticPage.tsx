import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { setBetStatisticTC } from '../../../redux/betStatisticReducer';
import { AppStoreType } from '../../../redux/redux'
import { connect } from 'react-redux';
import { bet_statistic_page_selectors } from '../../../Selectors/selectors'
import BetStatisticTable from './BetStatisticTable/BetStatisticTable';
import { FullBetStatisticDataType } from '../../../redux/betStatisticReducer'
import classes from "./BetStatisticPage.module.css"
import { PreloaderPageWithoutHeader } from '../../CommonComponents/PreloaderPage/PreloaderPage';
import { useSubscribeOnData } from '../../../Hooks/Hooks';
import { actions } from '../../../redux/betStatisticReducer';
import { withPreloader } from '../../../HOC/withPreloader';
import { NewKindOfBet, OddTypeType } from '../../../config';

type RoutePropsType = RouteComponentProps<{ db_name: string, kind_of_bet: NewKindOfBet, type_of_bet: OddTypeType }>

const BetStatisticPageContainer = ({ data, setBetStatisticTC, isGettingData, set_initial_state, match }: PropsType) => {
    useSubscribeOnData(setBetStatisticTC, set_initial_state, [match.params.db_name, match.params.kind_of_bet, match.params.type_of_bet])
    useEffect(() => {
        document.title = 'Bet Statistic'
    }, [])
    return <BetStatisticPage isGettingData = {isGettingData}
                             data = {data}
                             odd_type = {match.params.type_of_bet}/>
}

type BetStatisticPageProps = {
    odd_type: OddTypeType
    data: FullBetStatisticDataType
    isGettingData: boolean
}

let BetStatisticPage: React.FC<BetStatisticPageProps> = ({odd_type, data}) => {
    return (
        <div className={classes.bet_statistic_page}>
            <div className={classes.page_head}>
                Bet statistic
            </div>
            <BetStatisticTable data={data}
                odd_type={odd_type} />
        </div>
    )
}

BetStatisticPage = withPreloader<BetStatisticPageProps>(PreloaderPageWithoutHeader, 'isGettingData')(BetStatisticPage)

type MapStatePropsType = {
    data: FullBetStatisticDataType
    isGettingData: boolean
}

type MapDispatchPropsType = {
    setBetStatisticTC: (db_name: string, kind_of_bet: NewKindOfBet, type_of_bet: OddTypeType) => void
    set_initial_state: typeof actions.set_initial_state
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
    setBetStatisticTC,
    set_initial_state: actions.set_initial_state
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(BetStatisticPageContainer)