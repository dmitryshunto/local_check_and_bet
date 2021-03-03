import React from 'react'
import { MyNetChampionship, MyNetPredictionKindOfBetType, MyNetPredictionType, my_net_kinds_of_bet, Kinds_of_bet_type } from '../../../../../redux/my_net_main_page_reducer'
import classes from './MyNetChampionship.module.css'

const MyNetChampionshipTable: React.FC<MyNetChampionship> = (props) => {
    const games = props.predictions.map((game) => {
        return <MyNetGame key = {game.home_team_name} {...game} />
    })
    return (
        <div className={classes.my_net_championship_table}>
            <div className={classes.my_net_championship_caption}>{`${props.country_name} ${props.name_of_championship}`}</div>
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
                        <div className={classes.my_net_kinds_of_bet_cell}>Ex. total</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Out. Bet</div>
                        <div className={classes.my_net_kinds_of_bet_cell}>Tot. Bet</div>
                    </div>
                </div>
            </div>
                {games}
            <div/>
        </div>
    )
}

const MyNetGame: React.FC<MyNetPredictionType> = (props) => {
    const kinds_of_bet_items = my_net_kinds_of_bet.map((kind_of_bet, index) => {
        const payload: MyNetPredictionKindOfBetType | undefined = props[kind_of_bet]
        if (payload) {
            return (
                <MyNetGameKindOfBet key = {index} {...payload}
                                    kind_of_bet = {kind_of_bet} />
            )
        }
    })
    return (
        <div className={classes.my_net_game}>
            <div className={classes.my_net_game_teams_block}>
                {`${props.home_team_name} - ${props.away_team_name}`}
            </div>
            <div className={classes.my_net_kind_of_bet_items}>
                {kinds_of_bet_items}
            </div>
        </div>
    )
}

interface KOF extends MyNetPredictionKindOfBetType {
    kind_of_bet: Kinds_of_bet_type
}

const MyNetGameKindOfBet: React.FC<KOF> = (props) => {
    let score = `${props.home_team_scored} - ${props.away_team_scored}`
    if(props.home_team_scored === null || props.away_team_scored === null) {
        score = ''
    }
    return (
        <div className={classes.my_net_kinds_of_bet_row}>
            <div className={classes.my_net_kinds_of_bet_cell}>{props.kind_of_bet}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{props.book_w1}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{props.book_x}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{props.book_w2}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{score}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{props.expected_home_team}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{props.expected_away_team}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{props.expected_result}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{props.expected_total}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{`${props.outcome_bet_team || ''} ${props.handicap || ''}`}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{`${props.over_under_bet_type || ''} ${props.over_under_bet_total || ''}`}</div>
        </div>
    )
}

export default MyNetChampionshipTable