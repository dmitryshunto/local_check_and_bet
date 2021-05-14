import React from 'react'
import { MyProfileBets, MyProfileBetType } from '../../../redux/my_profile_reducer'
import { RenderFunction } from '../../CommonComponents/MyNetChampionship/MyNetChampionship'
import Table, { ColumnsType } from 'antd/lib/table/Table';
import { Empty } from 'antd';
import { ObjectKeys } from '../../../CommonFunctions/common_types';
import { SortOrder } from 'antd/lib/table/interface';
import { create_filters_and_onFilter, create_sorter } from '../../../CommonFunctions/typed_functions';
import classes from './UserBetsTable.module.css'

type UserBets = {
  user_bets: MyProfileBets
}

type ColumnsInfoType = {
  title: string
  dataIndex: ObjectKeys<MyProfileBetType>
  withSorter?: boolean
  withFilter?: boolean
}

const columns_info: ColumnsInfoType[] = [
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
    dataIndex: 'result_for_ui',
    withFilter: true
  },
  {
    title: 'Balance',
    dataIndex: 'balance'
  }
]

const create_columns = (user_bets: MyProfileBetType[]) => {
  const result: ColumnsType<MyProfileBetType> = []
  columns_info.forEach((column) => {
    const { dataIndex, title } = column
    let filters, onFilter, sorter, sortDirections: SortOrder[] | undefined, render: RenderFunction<MyProfileBetType> | undefined
    if (column.withFilter) {
      filters = create_filters_and_onFilter<MyProfileBetType>(user_bets, dataIndex)['filters']
      onFilter = create_filters_and_onFilter<MyProfileBetType>(user_bets, dataIndex)['onFilter']
    }
    if (column.withSorter) {
      sorter = create_sorter(dataIndex)
      sortDirections = ['descend', 'ascend']
    }
    if (dataIndex === 'result_for_ui') {
      render = (v, r) => {
        let className
        switch (r.result) {
          case 1:
            className = classes.win_bet
            break
          case 0:
            className = classes.back_bet
            break
          case -1:
            className = classes.lose_bet
            break
          default:
            break;
        }
        return <div className={className}>
          {r.result_for_ui}
        </div>
      }
    }
    let align: 'center' | undefined
    if(dataIndex === 'date_of_match' || dataIndex === 'balance') align = 'center'
    result.push({ filters, onFilter, sorter, render, sortDirections, title, dataIndex, key: dataIndex, align })
  })
  return result
}

const UserBets: React.FC<UserBets> = (props) => {
  if (!props.user_bets) return <Empty />
  const columns = create_columns(props.user_bets)
  return (
    <div className = {classes.user_bets_block}>
      <h3>Your bets</h3>
      <Table columns={columns} dataSource={props.user_bets} rowKey={(r) => r['bet_id']} size={'middle'} />
    </div>
  )
}


export default UserBets