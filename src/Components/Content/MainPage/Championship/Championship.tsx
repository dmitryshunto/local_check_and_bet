import React from 'react';
import classes from './Championship.module.css';
import { NavLink } from 'react-router-dom';
import { BetType } from '../../../../redux/betReducer'
import { MainPageChampionshipDataType } from '../../../../redux/championshipsReduser'
import Game from '../../../CommonComponents/Game/Game';
import GamesTableHead from '../../../CommonComponents/Game/GamesTableHead';
import { getTodayDate } from '../../../../CommonFunctions/commonFunctions';
import { CSSTransition } from 'react-transition-group';

type ChampionshipPropsType = {
  bets: BetType[] | []
  championship: MainPageChampionshipDataType
  addBet: (bet: BetType) => void
  removeBet: (bet: BetType) => void
  date_of_prediction: string
  changeChampionshipCheckedStatus: (name_of_championship: string, date_of_prediction: string) => void
}


const Championship: React.FC<ChampionshipPropsType> = React.memo((props) => {
  let { championship } = props
  
  const classNames = {
    enter: classes.my_node_enter,
    enterActive: classes.my_node_enter_active,
    exit: classes.my_node_exit,
    exitActive: classes.my_node_exit_active,
  }
  
  const checked_button_cn = championship.checked ? 'championship_checked_button' : 'championship_check_button'
  const checked_championship_cn = championship.checked ? 'championship_checked' : 'championship_table'
  let items = championship.games.map(game => <Game addedBets={props.bets}
    addBet={props.addBet}
    removeBet={props.removeBet}
    key={game.games_id}
    data={game}
    basic_totals={championship.basic_totals}
    name_of_championship={championship.name_of_championship}
    date_of_prediction={props.date_of_prediction} />)
  return (
    <div className={classes.predict_championship}>
      <div className={classes.championship_head}>
        <div className={classes.championship_link}>
          <NavLink to={`/championships/${championship.name_of_championship}`}>
            <h5>{championship.name_of_championship.toUpperCase() + ' '}</h5>
          </NavLink>
        </div>
        {getTodayDate() <= props.date_of_prediction &&
          <div className={classes[checked_button_cn]}>
            <button onClick={
              () => props.changeChampionshipCheckedStatus(props.championship.name_of_championship, props.date_of_prediction)
            }>
              {props.championship.checked ? 'Проверено' : 'Проверь'}
            </button>
          </div>
        }
      </div>
      <CSSTransition in = {!props.championship.checked} classNames = {{...classNames}} timeout = {300} unmountOnExit>
        <table className = {classes.championship_table}>
          <GamesTableHead />
          <tbody>
            {items}
          </tbody>
        </table>
      </CSSTransition>
    </div>
  );
})

export default Championship;