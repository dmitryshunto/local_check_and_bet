import React, { useState, useEffect } from 'react';
import { ChampionshipStatsDataType, TeamStatistic, BasicTotals } from '../../../../redux/championship_stats_reducer'
import classes from './ChampionshipStats.module.css'
import ToggleButton from '../../../CommonComponents/ToggleButton/ToggleButton';
import { HomeAwayItemsType, KindOfBetType } from '../../../../redux/redux'
import TotalSelector from '../../../CommonComponents/TotalSelector/TotalSelector';
import { get_total_info } from '../../../../CommonFunctions/typed_functions';

const kinds_of_bet_total_line = {
	goals: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
	ycard: [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5],
	corners: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5]
};

type PropsType = {
  championship_stats: ChampionshipStatsDataType
  name_of_championship: string
  basic_totals: BasicTotals
}

const ChampionshipStats: React.FC<PropsType> = ({ championship_stats, name_of_championship, basic_totals }) => {
 
  const [selected_kind_of_bet, set_selected_kind_of_bet] = useState<KindOfBetType>('goals')
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
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
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
                           totals_list = {kinds_of_bet_total_line[selected_kind_of_bet]}
                           setCurrentTotal = {setCurrentTotal}
                           requestSort = {requestSort}/>
    </div>
  )
}

type ChampionshipTablePropType = {
  data: Array<TeamStatistic>
  basic_total: number
  totals_list: number[]
  setCurrentTotal: (currentTotal: number) => void
  requestSort: (key: string) => void 
}

type DirectionType = 'ascending' | 'descending'

type SortConfigType = {
  key: string
  direction: DirectionType
}

const ChampionshipTable: React.FC<ChampionshipTablePropType> = ({ data, basic_total, setCurrentTotal, totals_list, requestSort }) => {
      
  const rows = data.map(team => <TeamRow key = {team.name_of_team} team = {team}/>)
  
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
          <td onClick={() => requestSort('win1')} rowSpan = {2}>П1</td>
          <td onClick={() => requestSort('x')} rowSpan = {2}>Х</td>
          <td onClick={() => requestSort('win2')} rowSpan = {2}>П2</td>
          <td onClick={() => requestSort('over')}>Больше</td>
          <td onClick={() => requestSort('under')}>Меньше</td>
          <td onClick={() => requestSort('power_of_scoring')} rowSpan = {2}>Рейтинг атаки</td>
          <td onClick={() => requestSort('power_of_missing')} rowSpan = {2}>Рейтинг защиты</td>
          <td onClick={() => requestSort('power_of_playing')} rowSpan = {2}>Рейтинг игры</td>
        </tr>
        <tr>
          <td colSpan = {2}>
            <div className = {classes.current_total_cell}>
              <TotalSelector basic_total = {basic_total}
                             totals_list = {totals_list}
                             callback = {setCurrentTotal}/>
            </div>
          </td>
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
      <td>{team.over}</td><td>{team.under}</td>
      <td>{team.power_of_scoring}</td><td>{team.power_of_missing}</td><td>{team.power_of_playing}</td>
    </tr>
  )
}


export default ChampionshipStats