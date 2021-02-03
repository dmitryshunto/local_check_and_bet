import React from 'react'
import { FullBetStatisticDataType, FullBetStatisticItemType } from '../../../../../../redux/bet_statistic_reducer'
import classes from './BetStatisticTable.module.css'

type TablePropsType = {
    data: FullBetStatisticDataType
}

const BetStatisticTable = ({data}: TablePropsType) => {
    const betStatisticTableItems = data?.map((item, index) => <BetStatisticTableItem data = {item}
                                                                                     key = {index}/>)
    return (
        <div className = {classes.bets_statistic_table}>
            <div className = {classes.table_head}>
                <div className = {classes.teams_and_fulltime_block}>
                    Матч
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
                        ИТ1
                    </div>
                    <div>
                        ИТ2
                    </div>
                    <div>
                        Тотал
                    </div>
                    <div>
                        Исход
                    </div>
                </div>
                <div className = {classes.bet_success_block}>
                    Результат
                </div>
            </div>
            {betStatisticTableItems}
        </div>
    )
}

type ItemPropsType = {
    data: FullBetStatisticItemType
}

const BetStatisticTableItem = ({data}: ItemPropsType) => {
    return (
        <div  className = {classes.bet_statistic_item}>
            <div className = {classes.teams_and_fulltime_block}>
                <div className = {data.team1_scored > data.team2_scored ? classes.team_block + ' ' + classes.win_team_block : classes.team_block}>
                    {data.name_of_team1}
                </div>
                <div className = {classes.full_time_block}>
                    <div>
                        {data.date_of_match}
                    </div>
                    <div>
                        {data.team1_scored + ':' + data.team2_scored}
                    </div>
                </div>
                <div className = {data.team2_scored > data.team1_scored ? classes.team_block + ' ' + classes.win_team_block : classes.team_block}>
                    {data.name_of_team2}
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
                    {data.expected_of_team1}
                </div>
                <div>
                    {data.expected_of_team2}
                </div>
                <div>
                    {data.expected_total}
                </div>
                <div>
                    {data.expected_result}
                </div>
            </div>
            <div className = {classes.bet_success_block} style = {{color: data.bet_success ? '#649e57' : 'rgb(204, 82, 44)'}}>
                <div>{data.bet_success ? 'V' : 'X'}</div>
            </div>
        </div>
    )
}

export default BetStatisticTable