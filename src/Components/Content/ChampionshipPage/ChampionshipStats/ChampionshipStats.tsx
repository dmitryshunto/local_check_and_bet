import React, { useState } from 'react';
import { ChampionshipStatsDataType, TeamStatistic, BasicTotals, KindsOfBetTotalIntervalType } from '../../../../redux/championship_stats_reducer'
import classes from './ChampionshipStats.module.css'
import ToggleButton from '../../../CommonComponents/ToggleButton/ToggleButton';
import { HomeAwayItemsType } from '../../../../redux/redux'
import TotalSelector from '../../../CommonComponents/TotalSelector/TotalSelector';
import { create_sorter } from '../../../../CommonFunctions/typed_functions';
import Table, { ColumnsType } from 'antd/lib/table';
import { NewKindOfBet } from '../../../../config';

const kinds_of_bet_total_interval: KindsOfBetTotalIntervalType = {
  goals: [0.5, 4.5],
  corners: [8, 11.5],
  yellow_cards: [1.5, 6],
  fouls: [18, 36],
  shots_on_goal: [5, 15]
}

type PropsType = {
  championship_stats: ChampionshipStatsDataType
  name_of_championship: string
  basic_totals: BasicTotals
}

const team_column: ColumnsType<TeamStatistic> = [
  {
    title: 'Team',
    dataIndex: 'name_of_team',
    sorter: create_sorter('name_of_team')
  },
  {
    title: 'Scores',
    dataIndex: 'scored',
    sorter: create_sorter('scored')
  },
  {
    title: 'Misses',
    dataIndex: 'missed',
    sorter: create_sorter('missed')
  },
  {
    title: 'Total',
    dataIndex: 'total',
    sorter: create_sorter('total')
  },
  {
    title: 'Wins',
    dataIndex: 'win1',
    sorter: create_sorter('win1')
  },
  {
    title: 'Draws',
    dataIndex: 'x',
    sorter: create_sorter('x')
  },
  {
    title: 'Defeats',
    dataIndex: 'win2',
    sorter: create_sorter('win2')
  },
]

const create_totals_columns = (totals_interval: number[], current_total: number, setCurrentTotal: (num: number) => void) => {
  const result: ColumnsType<TeamStatistic> = []
  const totals_list: number[] = []
  const [start_interval, end_interval] = totals_interval
  for (let i = start_interval; i <= end_interval; i += 0.5) {
    totals_list.push(i)
  }
  const index = totals_list.indexOf(current_total) ? totals_list.indexOf(current_total) : 0
  result.push({
    title: <TotalSelector totals_list={totals_list}
      callback={setCurrentTotal}
      basic_total={current_total} />,
    children: [
      {
        title: 'TO',
        render: (value, record) => {
          return (
            record.totals_info[index]['over']
          )
        },
        sorter: (a, b) => {
          return a['totals_info'][index]['over'] - b['totals_info'][index]['over']
        }
      },
      {
        title: 'TU',
        render: (value, record) => {
          return (
            record.totals_info[index]['under']
          )
        },
        sorter: (a, b) => {
          return a['totals_info'][index]['under'] - b['totals_info'][index]['under']
        }
      }
    ],
  })
  return result
}

const create_handicap_columns = () => {
  const result: ColumnsType<TeamStatistic> = []
  result.push({
    title: 'Basic handicap',
    children: [
      {
        title: '+',
        render: (value, record) => record['book_rating']['positive'],
        sorter: (a, b) => a['book_rating']['positive'] - b['book_rating']['positive']
      },
      {
        title: '=',
        render: (value, record) => record['book_rating']['neutral'],
        sorter: (a, b) => a['book_rating']['neutral'] - b['book_rating']['neutral']
      },
      {
        title: '-',
        render: (value, record) => record['book_rating']['negative'],
        sorter: (a, b) => a['book_rating']['negative'] - b['book_rating']['negative']
      }
    ]
  })
  return result
}

const ChampionshipStats: React.FC<PropsType> = (props) => {
  const [selected_kind_of_bet, set_selected_kind_of_bet] = useState<NewKindOfBet>('goals')
  const basic_total = props.basic_totals![selected_kind_of_bet]!
  const [currentTotal, setCurrentTotal] = useState<number | null>(null)
  const [selected_home_away, set_selected_home_away] = useState<HomeAwayItemsType>('home')

  const totals_interval = kinds_of_bet_total_interval![selected_kind_of_bet]!
  const total = currentTotal ? currentTotal : basic_total

  const columns = [...team_column, ...create_totals_columns(totals_interval, total, setCurrentTotal),
  ...create_handicap_columns()]

  const select_kind_of_bet = (kind_of_bet: NewKindOfBet) => {
    set_selected_kind_of_bet(kind_of_bet)
    setCurrentTotal(null)
  }

  return (
    <div>
      <h3>League statistic</h3>
      <div className={classes.content}>
        <ToggleButton kinds_of_bet={Object.keys(props.championship_stats)}
          selected_kind_of_bet={selected_kind_of_bet}
          set_selected_kind_of_bet={select_kind_of_bet}
          selected_home_away={selected_home_away}
          set_selected_home_away={set_selected_home_away}
        />
        <Table columns={columns} dataSource={props.championship_stats[selected_kind_of_bet]![selected_home_away]} pagination={false} 
               size = {'small'} rowKey = {(row) => row['name_of_team']} scroll = {{x: true, y: 500}}/>
      </div>
    </div>
  )
}

export default ChampionshipStats