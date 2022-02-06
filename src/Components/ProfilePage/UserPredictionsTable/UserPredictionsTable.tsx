import React from 'react'
import { useSelector } from 'react-redux'
import { propfile_selectors } from '../../../Selectors/selectors'
import { Empty, Table, Typography } from 'antd';
import { MyPrediction } from '../../../redux/my_profile_reducer';
import { ColumnsInfoType } from '../../../config';
import { create_columns } from '../ProfilePage';
import classes from '../ProfilePage.module.css'
import { roundPlus } from '../../../CommonFunctions/commonFunctions';

const { Text } = Typography

const columns_info: ColumnsInfoType<MyPrediction>[] = [
    {
        title: 'Date of match',
        dataIndex: 'date_of_match',
        withSorter: true
    },
    {
        title: 'Public',
        dataIndex: 'public',
        withFilter: true
    },
    {
        title: 'League',
        dataIndex: 'league_name',
        withSorter: true,
        withFilter: true
    },
    {
        title: 'Match',
        dataIndex: 'teams',
    },
    {
        title: 'Kind of bet',
        dataIndex: 'kind_of_bet',
        withFilter: true
    },
    {
        title: 'Odd type',
        dataIndex: 'odd_type',
        withFilter: true,
    },
    {
        title: 'Value',
        dataIndex: 'value',
        withFilter: true
    },
    {
        title: 'Odd',
        dataIndex: 'odd',
        withSorter: true
    },
    {
        title: 'Match result',
        dataIndex: 'result_of_match'
    },
    {
        title: 'Status',
        dataIndex: 'result',
        withFilter: true
    },
    {
        title: 'Description',
        dataIndex: 'description'
    }
]

const UserPredictions: React.FC = () => {
    const predictions = useSelector(propfile_selectors.getPreditions)
    if (!predictions) return <Empty />
    const columns = create_columns(predictions, columns_info)
    return (
        <div className={classes.user_table_block}>
            <h3>Your predictions</h3>
            <Table columns={columns} dataSource={predictions} pagination={false} rowKey={(r) => r['id']}
                size={'middle'} scroll={{ x: true, y: 600 }}
                summary={items => {
                    let balance = 0
                    items.forEach(item => {
                        let item_balance = 0
                        if (item['result'] === 1) item_balance = item['odd'] - 1
                        if (item['result'] === -1) item_balance = -1
                        balance += item_balance
                    })
                    return (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>Number of predctions:</Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{items?.length ? items.length : 0}</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>Balance:</Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>
                                <Text >{roundPlus(balance, 2)}</Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )
                }} />
        </div>
    )
}

export default UserPredictions