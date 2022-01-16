import React from 'react'
import { FullBetStatisticDataType, FullBetStatisticItemType } from '../../../../redux/betStatisticReducer'
import classes from './BetStatisticTable.module.css'
import cn from 'classnames'
import Table, { ColumnsType } from 'antd/lib/table'
import { Empty } from 'antd'
import { OddTypeType } from '../../../../config'
import { create_filters_and_onFilter } from '../../../ProfilePage/ProfilePage'

export type TablePropsType = {
    data: FullBetStatisticDataType
    odd_type: OddTypeType
}
const create_columns = (data_items: FullBetStatisticItemType[], odd_type: OddTypeType) => {
    const columns: ColumnsType<FullBetStatisticItemType> = [
        {
            title: '№',
            render: (v, r, index) => index + 1,
            align: 'center'
        },
        {
            title: "Match",
            children: [
                {
                    title: 'Home team',
                    render: (v, r) => {
                        const className = cn({
                            [classes.win_team_block]: r.home_team_scored > r.away_team_scored,
                        })
                        return (
                            <div className={className}>
                                {r.home_team_name}
                            </div>
                        )
                    },
                    align: 'center',
                    filters: create_filters_and_onFilter<FullBetStatisticItemType>(data_items, 'home_team_name')['filters'],
                    onFilter: create_filters_and_onFilter<FullBetStatisticItemType>(data_items, 'home_team_name')['onFilter']
                },
                {
                    render: (v, data) => {
                        return (
                            <div className={classes.full_time_block}>
                                <div>
                                    {data.date_of_match}
                                </div>
                                <div>
                                    {data.home_team_scored !== null ? `${data.home_team_scored}:${data.away_team_scored}` : ':'}
                                </div>
                            </div>
                        )
                    },
                    align: 'center'
                },
                {
                    title: 'Away team',
                    render: (v, r) => {
                        const className = cn({
                            [classes.win_team_block]: r.away_team_scored > r.home_team_scored,
                        })
                        return (
                            <div className={className}>
                                {r.away_team_name}
                            </div>
                        )
                    },
                    align: 'center',
                    filters: create_filters_and_onFilter<FullBetStatisticItemType>(data_items, 'away_team_name')['filters'],
                    onFilter: create_filters_and_onFilter<FullBetStatisticItemType>(data_items, 'away_team_name')['onFilter']
                },
            ]
        },
        {
            title: 'Book Line',
            children: [
                {
                    title: 'W1',
                    render: (v, data) => data.book_win1 ? data.book_win1 : '-'
                },
                {
                    title: 'X',
                    render: (v, data) => data.book_x ? data.book_x : '-'
                },
                {
                    title: 'W2',
                    render: (v, data) => data.book_win2 ? data.book_win2 : '-'
                },
            ]
        },
        {
            title: 'Ex. result',
            dataIndex: 'expected_result',
            align: 'center'
        },
        {
            title: 'Ex. total',
            dataIndex: 'expected_total',
            align: 'center'
        },
        {
            title: 'Bet',
            render: (v, data) => `${odd_type} ${data.value}`,
            align: 'center'
        },
        {
            title: 'Bet result',
            render: (v, data) => {
                return (
                    <div className={
                        cn({
                            [classes.win_bet]: data.bet_success === 1,
                            [classes.back_bet]: data.bet_success === 0,
                            [classes.lose_bet]: data.bet_success === -1
                        })}>
                        {data.bet_success === 1 && 'V'}
                        {data.bet_success === 0 && '='}
                        {data.bet_success === -1 && 'X'}
                    </div>
                )
            },
            align: 'center'
        }
    ]
    return columns
}

const BetStatisticTable = React.memo(({ data, odd_type }: TablePropsType) => {
    if (!data) return <Empty />
    const columns = create_columns(data, odd_type)
    return (
        <Table columns={columns} dataSource={data} rowKey = {(r) => `${r['home_team_name']}_${Math.random()}`} size = {'small'}/>
    )
})

export default BetStatisticTable