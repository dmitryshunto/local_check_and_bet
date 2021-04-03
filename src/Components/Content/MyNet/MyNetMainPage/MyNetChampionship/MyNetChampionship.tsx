import React from 'react'
import { actions, MyNetChampionship } from '../../../../../redux/my_net_main_page_reducer'
import classes from './MyNetChampionship.module.css'
import { NavLink } from 'react-router-dom'
import MyNetGame from '../../../../CommonComponents/MyNetGame/MyNetGame'
import { BetType } from '../../../../../redux/betReducer'
import { getTodayDate } from '../../../../../CommonFunctions/commonFunctions'
import cn from 'classnames';

type MyNetChampionshipType = {
    data: MyNetChampionship
    date_of_match: string
    selectBetTC: (bet: BetType) => void
    bets: [] | BetType[]
    changeChampionshipCheckedStatus: typeof actions.changeChampionshipCheckedStatus
}

const MyNetChampionshipTable: React.FC<MyNetChampionshipType> = React.memo((props) => {

    const checked_button_cn = props.data.checked ? 'green_text_selection' : 'red_text_selection'

    const games = props.data.predictions.map((game) => {
        return <MyNetGame key={game.home_team_name}
            bets={props.bets}
            data={game}
            selectBetTC={props.selectBetTC}
        />
    })
    return (
        <div className={classes.my_net_championship_table}>
            <div className={classes.my_net_championship_caption}>
                <NavLink to={`/championships/${props.data.db_name}`}>
                    {`${props.data.country_name} ${props.data.name_of_championship}`}
                </NavLink>
                {getTodayDate() <= props.date_of_match &&
                    <div className={classes[checked_button_cn]}>
                        <button onClick={
                            () => props.changeChampionshipCheckedStatus(props.data.db_name, props.date_of_match)
                        }>
                            {props.data.checked ? 'Checked' : 'Check'}
                        </button>
                    </div>
                }
            </div>
            <div className = {cn({[classes.championship_checked]: props.data.checked && getTodayDate() <= props.date_of_match})}>
            <div className={classes.my_net_game}>
                <div className={classes.my_net_game_teams_block}></div>
                <div className={classes.my_net_kind_of_bet_items}>
                    <div className={classes.my_net_kinds_of_bet_row}>
                        <div className={classes.my_net_kinds_of_bet_cell}>kind</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>W1</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>X</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>W2</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Score</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex. home IT</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex. away IT</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex. result</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex.W1</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex.X</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex.W2</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex.total</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex.TO</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex.TU</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex.BACK</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Out. Bet</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Tot. Bet</div>
                    </div>
                </div>
            </div>
            {games}
            <div />
            </div>
        </div>
    )
})
export default MyNetChampionshipTable