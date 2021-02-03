import React from 'react';
import classes from './BetBlock.module.css';
import { connect } from 'react-redux';
import { getAddedBets } from '../../../../../Selectors/selectors';
import { createBetMarkets } from '../../../../../CommonFunctions/commonFunctions'
import ThreeWayBetMarket from './BetMarkets/ThreeWayBetMarket'
import TwoWayBetMarket from './BetMarkets/TwoWayBetMarket'
import {ScoreBoardBetBlockType} from '../../../../../redux/game_stats_reducer'
import {KindOfBetType, AppStoreType} from '../../../../../redux/redux'
import {BetType, actions, addBetActionType, removeBetActionType} from '../../../../../redux/betReducer'

type PropsTypes = MapStateToPropsType & MapDispatchToPropsType & OwnPropsTypes

type OwnPropsTypes = {
    name_of_championship: string
    names_of_teams: string[]
    basic_total: number
    bet_block: ScoreBoardBetBlockType
    addedBets: BetType[] | []
    kind_of_bet: KindOfBetType
    date_of_match: string
}

const BetBlock: React.FC<PropsTypes> = (props) => {
    const BetMarkets = createBetMarkets(props, classes, ThreeWayBetMarket, TwoWayBetMarket, props.name_of_championship)
    return (
        <div className={classes.bet_block}>
            <div className={classes.bet_block_head}>
                Линия
            </div>
            {BetMarkets[0]}
            {BetMarkets[1]}
        </div>
    )
}

type MapDispatchToPropsType = {
    addBet: (bet: BetType) => addBetActionType
    removeBet: (bet: BetType) => removeBetActionType
}

let mapDispatchToProps: MapDispatchToPropsType = {
    addBet: actions.addBet,
    removeBet: actions.removeBet
}

type MapStateToPropsType = {
    bets: BetType[] | []
}

let mapStateToProps = (state: AppStoreType): MapStateToPropsType => {
    return {
        bets: getAddedBets(state)
    }
}


export default connect<MapStateToPropsType, MapDispatchToPropsType, OwnPropsTypes, AppStoreType>(mapStateToProps, mapDispatchToProps)(BetBlock);