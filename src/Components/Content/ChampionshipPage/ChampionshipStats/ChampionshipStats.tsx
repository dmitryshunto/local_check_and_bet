import React, { useState, useEffect } from 'react';
import { ChampionshipStatsDataType, TeamStatistic, BasicTotals, KindsOfBetTotalIntervalType } from '../../../../redux/championship_stats_reducer'
import classes from './ChampionshipStats.module.css'
import ToggleButton from '../../../CommonComponents/ToggleButton/ToggleButton';
import { HomeAwayItemsType, NewKindOfBet } from '../../../../redux/redux'
import TotalSelector from '../../../CommonComponents/TotalSelector/TotalSelector';
import { get_total_info } from '../../../../CommonFunctions/typed_functions';

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

const ChampionshipStats: React.FC<PropsType> = ({ championship_stats, name_of_championship, basic_totals }) => {
 
  const [selected_kind_of_bet, set_selected_kind_of_bet] = useState<NewKindOfBet>('goals')
  const [selected_home_away, set_selected_home_away] = useState<HomeAwayItemsType>('home')
  const [sortConfig, setSortConfig] = useState<SortConfigType | null>({key: 'name_of_team', direction: 'ascending'})
  const basic_total = basic_totals![selected_kind_of_bet]!
  const [currentTotal, setCurrentTotal] = useState<number>(basic_total)
  useEffect(() => {
    setCurrentTotal(basic_total)
  }, [basic_total])

  const requestSort = (key: string) => {
    let direction: DirectionType = 'ascending'
    if(sortConfig) {
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending'
      }
    }
    setSortConfig({ key, direction });
  }


  const data = championship_stats[selected_kind_of_bet]![selected_home_away]

  let sortedData = data.map((team): TeamStatistic => {
    return {
      ...team,
      over: get_total_info(team.totals_info, currentTotal).over,
      under: get_total_info(team.totals_info, currentTotal).under
    }
  })

  if(sortConfig) {
    sortedData.sort((a, b) => {
      let first_elem, second_elem
      if(sortConfig.key.includes('br')) {
        const prop_name = sortConfig.key.slice(3)
        first_elem = a['book_rating'][prop_name]
        second_elem = b['book_rating'][prop_name]
        
      } else {
        first_elem = a[sortConfig.key]
        second_elem = b[sortConfig.key]
      }
      
      if (first_elem < second_elem) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (first_elem > second_elem) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <div className={classes.championship_stats}>
      <div className={classes.championship_table_head}>
        <div className={classes.name_of_championship_block}>
          <span>{name_of_championship.toUpperCase()}</span>
        </div>
        <ToggleButton kinds_of_bet={Object.keys(championship_stats)}
          selected_kind_of_bet={selected_kind_of_bet}
          set_selected_kind_of_bet={set_selected_kind_of_bet}
          selected_home_away={selected_home_away}
          set_selected_home_away={set_selected_home_away}
        />

      </div>
        <ChampionshipTable data={sortedData} 
                           basic_total = {basic_totals![selected_kind_of_bet]!}
                           totals_interval = {kinds_of_bet_total_interval![selected_kind_of_bet]!}
                           setCurrentTotal = {setCurrentTotal}
                           requestSort = {requestSort}/>
    </div>
  )
}

type ChampionshipTablePropType = {
  data: Array<TeamStatistic>
  basic_total: number
  totals_interval: number[]
  setCurrentTotal: (currentTotal: number) => void
  requestSort: (key: string) => void 
}

type DirectionType = 'ascending' | 'descending'

type SortConfigType = {
  key: string | 'br_positive' | 'br_negative' | 'br_neutral'
  direction: DirectionType
}

const ChampionshipTable: React.FC<ChampionshipTablePropType> = ({ data, basic_total, setCurrentTotal, totals_interval, requestSort }) => {
      
  const rows = data.map(team => <TeamRow key = {team.name_of_team} team = {team}/>)
  const totals_list: number[] = []
  const [start_interval, end_interval] = totals_interval
  for(let i = start_interval; i <= end_interval; i += 0.5) {
    totals_list.push(i)
  }
  return (
    <table className={classes.championship_table}>
      <thead>
        <tr>
          <td className={classes.names_of_team_head} rowSpan = {2} 
              onClick={() => requestSort('name_of_team')}>Команда</td>
          <td onClick={() => requestSort('number_of_games')} rowSpan = {2}>Матчей</td>
          <td onClick={() => requestSort('scored')} rowSpan = {2}>Забивает</td>
          <td onClick={() => requestSort('missed')} rowSpan = {2}>Пропускает</td>
          <td onClick={() => requestSort('total')} rowSpan = {2}>Тотал</td>
          <td onClick={() => requestSort('win1')} rowSpan = {2}>Победа</td>
          <td onClick={() => requestSort('x')} rowSpan = {2}>Ничья</td>
          <td onClick={() => requestSort('win2')} rowSpan = {2}>Поражение</td>
          <td onClick={() => requestSort('over')}>Больше</td>
          <td onClick={() => requestSort('under')}>Меньше</td>
          <td colSpan = {3}>Базовая фора</td>
        </tr>
        <tr>
          <td colSpan = {2}>
            <div className = {classes.current_total_cell}>
              <TotalSelector basic_total = {basic_total}
                             totals_list = {totals_list}
                             callback = {setCurrentTotal}/>
            </div>
          </td>
          <td onClick={() => requestSort('br_positive')}>+</td><td onClick={() => requestSort('br_neutral')}>=</td>
          <td onClick={() => requestSort('br_negative')}>-</td>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}




type TeamRowPropsTypes = {
  team: TeamStatistic
}

const TeamRow: React.FC<TeamRowPropsTypes> = ({team}) => {
  return (
    <tr>
      <td>{team.name_of_team}</td><td>{team.number_of_games}</td>
      <td>{team.scored}</td><td>{team.missed}</td><td>{team.total}</td>
      <td>{team.win1}</td><td>{team.x}</td><td>{team.win2}</td>
      <td>{team.over}</td><td>{team.under}</td><td>{team.book_rating.positive}</td>
      <td>{team.book_rating.neutral}</td><td>{team.book_rating.negative}</td>
    </tr>
  )
}


export default ChampionshipStats