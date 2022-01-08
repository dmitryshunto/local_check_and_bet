import React from 'react'
import { MyProfileBets, MyProfileBetType } from '../../../redux/my_profile_reducer'
import Table from 'antd/lib/table/Table';
import { Empty } from 'antd';
import classes from '../ProfilePage.module.css'
import { ColumnsInfoType } from '../../../config';
import { create_columns } from '../ProfilePage';

type UserBets = {
  user_bets: MyProfileBets
}

const columns_info: ColumnsInfoType<MyProfileBetType>[] = [
  {
    title: 'Date of match',
    dataIndex: 'date_of_match',
    withSorter: true
  },
  {
    title: 'League',
    dataIndex: 'name_of_championship',
    withSorter: true,
    withFilter: true
  },
  {
    title: 'Home team',
    dataIndex: 'home_team',
    withFilter: true
  },
  {
    title: 'Away team',
    dataIndex: 'away_team',
    withFilter: true
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
    title: 'Balance',
    dataIndex: 'balance'
  }
]

const UserBets: React.FC<UserBets> = (props) => {
  if (!props.user_bets) return <Empty />
  const columns = create_columns(props.user_bets, columns_info)
  return (
    <div className = {classes.user_table_block}>
      <h3>Your bets</h3>
      <Table columns={columns} dataSource={props.user_bets} rowKey={(r) => r['bet_id']} size={'middle'} />
    </div>
  )
}


export default UserBets