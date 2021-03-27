import React from 'react';
import classes from './ScoreBoardBlock.module.css';
import BetBlock from './BetBlock/BetBlock';
import {ScoreBoardKindOfBetDataType} from '../../../../redux/game_stats_reducer'
import {BetType} from '../../../../redux/betReducer'
import {NewKindOfBet} from '../../../../redux/redux'

type PropsTypes = {
    names_of_teams: string[]
    score_board_block: ScoreBoardKindOfBetDataType
    date_of_match: string
    addedBets: BetType[] | []
    kind_of_bet: NewKindOfBet
    basic_total: number
    selectBetTC: (bet: BetType) => void
    game_id: number
    db_name: string
}

const ScoreBoardBlock: React.FC<PropsTypes> = ({ names_of_teams, score_board_block, date_of_match, addedBets, kind_of_bet, ...props }) => {
    return (
        <div className={classes.score_board_table}>
            <div className={classes.score_board_table_head}>
                Обзор матча
            </div>
            <div className={classes.score_board_content}>
                <div className = {classes.date_of_match_block}>
                    {date_of_match}
                </div>
                <div className={classes.main_block}>
                    <div className = {classes.main_block_item}>
                        <h3>{names_of_teams[0]}</h3>
                    </div>
                        <Score team1 = {score_board_block.home}
                               team2 = {score_board_block.away}/>
                    <div className = {classes.main_block_item}>
                        <h3>{names_of_teams[1]}</h3>
                    </div>
                </div>
                <div className={classes.more_info_block}>
                    <div className={classes.line}>
                        <hr />
                    </div>
                    <div className={classes.more_info_button}>
                        <span>
                            Match Info
                        </span>
                    </div>
                    <div className={classes.line}>
                        <hr />
                    </div>
                </div>
            </div>
            <BetBlock bet_block = {score_board_block.bet_block}
                      addedBets = {addedBets}
                      kind_of_bet = {kind_of_bet}
                      date_of_match = {date_of_match}
                      selectBetTC = {props.selectBetTC}
                      game_id = {props.game_id}
                      db_name = {props.db_name}
                      home_team = {names_of_teams[0]}
                      away_team = {names_of_teams[1]}
                      />
        </div>
    )
}

type ScorePropsTypes = {
    team1: number | null
    team2: number | null
}

const Score: React.FC<ScorePropsTypes> = ({team1, team2}) => {
    return (
        <div className = {classes.main_block_item}>
            {team1 !== null ? <h3>{team1 + " : " + team2}</h3> : ":"}
        </div>
    )
}


export default ScoreBoardBlock;