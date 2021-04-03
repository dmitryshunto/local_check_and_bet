import React, { useState } from 'react'
import TableFilter from 'react-table-filter'
import './styles.css'
import classes from './UserBetsTable.module.css'

const UserBetsTable = (props) => {
  let [number_of_visible_items, set_number_of_visible_items] = useState(10)
  let [current_data, set_current_data] = useState(null)

  const filterUpdated = (newData) => {
    set_current_data(newData)
  }
  let items

  if(current_data === null) {
    if(props.my_profile_data_items) items = props.my_profile_data_items
    else items = null
  } else{
    items = current_data
  } 
  const elementsHtml = items ? items.map((item, index) => {
    if (index < number_of_visible_items) {
      return (
        <DataItem key={index}
          {...item}
          classes={props.classes}
        />
      )
    } else return null
  }) : null
  return (
    <div className={classes.table_container}>
      <table className={classes.user_bets_table}>
        <thead>
          <TableFilter
            rows={items}
            onFilterUpdate={filterUpdated}>
            <th key="date_of_match" filterkey="date_of_match" className={props.classes.date_of_match_block} casesensitive={'true'} showsearch={'true'}>
              Date
            </th>
            <th key="name_of_championship" filterkey="name_of_championship">
              League
            </th>
            <th key="match" filterkey="match">
              Match
            </th>
            <th key="kind_of_bet" filterkey="kind_of_bet">
              Kind of bet
            </th>
            <th key="odd_type" filterkey="odd_type">
              Bet
            </th>
            <th key="bet_size" filterkey="bet_size">
              Bet Size
            </th>
            <th key="odd" filterkey="odd">
              Odd
            </th>
            <th key="match_result" filterkey="match_result">
              Match result
            </th>
            <th key="result" filterkey="result">
              Bet result
            </th>
            <th key="balance" filterkey="balance">
              Balance
            </th>
          </TableFilter>
        </thead>
        <tbody>
          {elementsHtml}
        </tbody>
      </table>
      {elementsHtml && elementsHtml.length > number_of_visible_items &&
        <div className={classes.show_more_button}>
          <button onClick={() => set_number_of_visible_items(number_of_visible_items + 10)}>Show more</button>
        </div>
      }
    </div>

  )
}

const DataItem = (props) => {
  let result_className = ''
  let result_content = '-'

  if (props.result !== null) {
    if (+props.result === 1) {
      result_className = 'win_bet'
      result_content = 'win'
    } else if (+props.result === 0 && props.result !== null) {
      result_className = 'back_bet'
      result_content = 'back'
    } else if (+props.result === -1) {
      result_className = 'lose_bet'
      result_content = 'lose'
    }
  }

  return (
    <tr className={classes.user_bet}>
      <td>{props.date_of_match}</td>
      <td>{props.name_of_championship.toUpperCase()}</td>
      <td>{props.home_team + '-' + props.away_team}</td>
      <td>{props.kind_of_bet}</td>
      <td>{`${props.odd_type}${props.value ? ` ${props.value}` : ''}`}</td>
      <td>{props.bet_size}</td>
      <td>{props.odd}</td>
      <td>{props.result_of_match ? props.result_of_match : '-'}</td>
      <td className={classes.result_of_bet_block + ' ' + classes[result_className]}>{result_content}</td>
      <td>{props.balance}</td>
    </tr>
  )
}

export default UserBetsTable