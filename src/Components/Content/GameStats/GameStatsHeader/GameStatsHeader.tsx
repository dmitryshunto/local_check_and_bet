import React from 'react';
import classes from './GameStatsHeader.module.css'

type ScorePropsTypes = {
    team1: number | null
    team2: number | null
}

const Score: React.FC<ScorePropsTypes> = ({ team1, team2 }) => {
    return (
        <div className={classes.main_block_item}>
            {team1 !== null ? <div>{team1 + " : " + team2}</div> : ":"}
        </div>
    )
}

type GameStatsHeaderProps = {
    date_of_match: string
    names_of_teams: string[]
    home_team_scored: number | null
    away_team_scored: number | null
}

const GameStatsHeader: React.FC<GameStatsHeaderProps> = (props) => {
    return (
        <div className = {classes.game_stats_header}>
            <div className={classes.score_board_table_head}>
                Match Summary
            </div>
            <div className={classes.score_board_content}>
                <div className={classes.date_of_match_block}>
                    {props.date_of_match}
                </div>
                <div className={classes.main_block}>
                    <div className={classes.main_block_item}>
                        <div>{props.names_of_teams[0]}</div>
                    </div>
                    <Score team1={props.home_team_scored}
                        team2={props.away_team_scored} />
                    <div className={classes.main_block_item}>
                        <div>{props.names_of_teams[1]}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameStatsHeader;