import React, { useState } from 'react'
import TableFilter from 'react-table-filter'
import { translate_kind_of_bet_and_home_away } from '../../../CommonFunctions/commonFunctions'
import { } from './styles.css'
import classes from './UserBetsTable.module.css'

const UserBetsTable = (props) => {
  let [number_of_visible_items, set_number_of_visible_items] = useState(10)
  let [current_data, set_current_data] = useState(null)

  const filterUpdated = (newData) => {
    set_current_data(newData)
  }

  const items = current_data == null ? props.my_profile_data_items : current_data
  const elementsHtml = items.map((item, index) => {
    if (index < number_of_visible_items) {
      return (
        <DataItem key={index}
          date_of_match={item.date_of_match}
          name_of_championship={item.name_of_championship}
          name_of_team1={item.name_of_team1}
          name_of_team2={item.name_of_team2}
          kind_of_bet={item.kind_of_bet}
          odd_type={item.odd_type}
          odd={item.odd}
          result_of_match={item.result_of_match}
          result={item.result}
          balance={item.balance}
          classes={props.classes}
        />
      )
    } else return null
  });
  return (
    <div className = {classes.table_container}>
      <table className = {classes.user_bets_table}>
        <thead>
          <TableFilter
            rows={items}
            onFilterUpdate={filterUpdated}>
            <th key="date_of_match" filterkey="date_of_match" className={props.classes.date_of_match_block} casesensitive={'true'} showsearch={'true'}>
              Дата
            </th>
            <th key="name_of_championship" filterkey="name_of_championship">
              Лига
            </th>
            <th key="match" filterkey="match">
              Матч
            </th>
            <th key="kind_of_bet" filterkey="kind_of_bet">
              Вид
            </th>
            <th key="odd_type" filterkey="odd_type">
              Ставка
            </th>
            <th key="odd" filterkey="odd">
              Коэф.
            </th>
            <th key="match_result" filterkey="match_result">
              Результат матча
            </th>
            <th key="result" filterkey="result">
              Результат
            </th>
            <th key="balance" filterkey="balance">
              Баланс
            </th>
          </TableFilter>
        </thead>
        <tbody>
          {elementsHtml}
        </tbody>
      </table>
      {elementsHtml.length > number_of_visible_items &&
        <div className={classes.show_more_button}>
          <button onClick={() => set_number_of_visible_items(number_of_visible_items + 10)}>Показать больше</button>
        </div>
      }
    </div>

  )
}

const DataItem = (props) => {
  let result_className = ''
  let result_content = '-'
  if (+props.result === 1) {
    result_className = 'win_bet'
    result_content = 'Победа'
  } else if (+props.result === 0 && props.result !== null) {
    result_className = 'back_bet'
    result_content = 'Возврат'
  } else if (+props.result === -1) {
    result_className = 'lose_bet'
    result_content = 'Проигрыш'
  }
  return (
    <tr className = {classes.user_bet}>
      <td>{props.date_of_match}</td>
      <td>{props.name_of_championship.toUpperCase()}</td>
      <td>{props.name_of_team1 + '-' + props.name_of_team2}</td>
      <td>{translate_kind_of_bet_and_home_away(props.kind_of_bet)}</td>
      <td>{props.odd_type}</td>
      <td>{props.odd}</td>
      <td>{props.result_of_match}</td>
      <td className={classes.result_of_bet_block + ' ' + classes[result_className]}>{result_content}</td>
      <td>{props.balance}</td>
    </tr>
  )
}

export default UserBetsTable