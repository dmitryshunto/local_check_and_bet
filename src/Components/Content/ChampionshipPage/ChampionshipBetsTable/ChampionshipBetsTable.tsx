import React, { useState } from 'react'
import { BetStatisticType, KindOfBetStatisticItemType } from "./../../../../redux/championship_stats_reducer";
import classes from './ChampionshipBetsTable.module.css';
import { NewKindOfBet } from '../../../../redux/redux'
import { NavLink, useRouteMatch } from 'react-router-dom';
import ToggleButtons from '../../../CommonComponents/ToggleButton/ToggleButton';

type PropsType = {
    bet_statistic: BetStatisticType
}

const ChampionshipBetsTable = ({ bet_statistic }: PropsType) => {
    const [selected_kind_of_bet, set_selected_kind_of_bet] = useState<NewKindOfBet>('goals')
    let types_of_bet: any[] = []
    for (const bet_name in bet_statistic[selected_kind_of_bet]) {
        types_of_bet = [...types_of_bet, <BetItem bet_info={bet_statistic[selected_kind_of_bet]![bet_name]}
            kind_of_bet={selected_kind_of_bet}
            bet_name={bet_name}
            key={bet_name} />]
    }
    return (
        <div className = {classes.bets_block}>
            <h3>Statistic of prediction</h3>
            <div className={classes.bets_table}>
                <ToggleButtons kinds_of_bet={Object.keys(bet_statistic)}
                    selected_kind_of_bet={selected_kind_of_bet}
                    set_selected_kind_of_bet={set_selected_kind_of_bet}
                />
                <div className={classes.bets_table_content}>
                    {types_of_bet}
                </div>
            </div>
        </div>
    )
}

type BetItemProps = {
    bet_info: KindOfBetStatisticItemType
    bet_name: string
    kind_of_bet: string
}

const BetItem = ({ bet_info, bet_name, kind_of_bet }: BetItemProps) => {
    let { url } = useRouteMatch()
    return (
        <NavLink to={`${url}/${kind_of_bet}/${bet_name}`}>
            <div>{bet_name}</div>
            <div>{`${bet_info.bet_success} (${bet_info.count})`}</div>
        </NavLink>
    )
}


export default ChampionshipBetsTable