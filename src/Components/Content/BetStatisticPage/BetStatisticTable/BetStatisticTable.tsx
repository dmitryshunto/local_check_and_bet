import React from 'react'
import { OddTypeType } from '../../../../redux/betReducer'
import { FullBetStatisticDataType, FullBetStatisticItemType } from '../../../../redux/bet_statistic_reducer'
import classes from './BetStatisticTable.module.css'
import cn from 'classnames'

export type TablePropsType = {
    data: FullBetStatisticDataType
    odd_type: OddTypeType
}

const BetStatisticTable = ({data, odd_type}: TablePropsType) => {
    const betStatisticTableItems = data?.map((item, index) => <BetStatisticTableItem data = {item}
                                                                                     odd_type = {odd_type}
                                                                                     key = {index}
                                                                                     index = {index + 1}/>)
    return (
        <div className = {classes.bets_statistic_table}>
            <div className = {classes.table_head}>
                <div className = {classes.teams_and_fulltime_block}>
                    Match
                </div>
                <div className = {classes.odd_blocks}>
                    <div>
                        1
                    </div>
                    <div>
                        x
                    </div>
                    <div>
                        2
                    </div>
                </div>
                <div className = {classes.predict_block}>
                    <div>
                        Ex. Total
                    </div>
                    <div>
                        Ex. Outcome
                    </div>
                    <div>
                        Bet
                    </div>
                </div>
                <div className = {classes.bet_success_block}>
                    Bet result
                </div>
            </div>
            {betStatisticTableItems}
        </div>
    )
}

type ItemPropsType = {
    data: FullBetStatisticItemType
    odd_type: OddTypeType
    index: number
}

export const BetStatisticTableItem = ({data, odd_type, index}: ItemPropsType) => {
    return (
        <div  className = {classes.bet_statistic_item}>
            <div className = {classes.teams_and_fulltime_block}>
                <div>
                    {index}
                </div>
                <div className = {data.home_team_scored > data.away_team_scored ? classes.team_block + ' ' + classes.win_team_block : classes.team_block}>
                    {data.home_team_name}
                </div>
                <div className = {classes.full_time_block}>
                    <div>
                        {data.date_of_match}
                    </div>
                    <div>
                        {data.home_team_scored !== null ? `${data.home_team_scored}:${data.away_team_scored}`: ':'}
                    </div>
                </div>
                <div className = {data.away_team_scored > data.home_team_scored ? classes.team_block + ' ' + classes.win_team_block : classes.team_block}>
                    {data.away_team_name}
                </div>
            </div>
            <div className = {classes.odd_blocks}> 
                <div>
                    {data.book_win1 ? data.book_win1 : '-'}
                </div>
                <div>
                    {data.book_x ? data.book_x : '-'}
                </div><div>
                    {data.book_win2 ? data.book_win2 : '-'}
                </div>
            </div>
            <div className = {classes.predict_block}>
                <div>
                    {data.expected_total}
                </div>
                <div>
                    {data.expected_result}
                </div>
                <div>
                    {`${odd_type} ${data.value}`}
                </div>
            </div>
            <div className = {classes.bet_success_block}>
                <div className = {
                    cn({[classes.win_bet]: data.bet_success === 1,
                        [classes.back_bet]: data.bet_success === 0,
                        [classes.lose_bet]: data.bet_success === -1
                    })}>
                    {data.bet_success === 1 && 'V'}
                    {data.bet_success === 0 && '='}
                    {data.bet_success === -1 && 'X'}
                </div>
            </div>
        </div>
    )
}

export default BetStatisticTable