import React from 'react';
import { useState } from 'react';
import ToggleTeamButton from '../ToggleTeamButton/ToggleTeamButton';
import classes from '../MatchAnalysis.module.css'
import { InfoAboutLastMatchesItemType, InfoAboutMatchType } from '../../../../../redux/game_stats_reducer'
import { HomeAwayItemsType } from '../../../../../redux/redux'

type PropsType = {
    names_of_teams: Array<string>
    last_games_info: InfoAboutLastMatchesItemType
}

const LastMatchesBlock: React.FC<PropsType> = ({ last_games_info, names_of_teams }) => {
    let [team, setTeam] = useState<HomeAwayItemsType>('home');
    const home_team_last_games = last_games_info.home_team_results.map(payload => {
        return <LastMatchesBlockRow payload={payload} key = {last_games_info.home_team_results.indexOf(payload)} />
    })

    const away_team_last_games = last_games_info.away_team_results.map(payload => {
        return <LastMatchesBlockRow payload={payload} key = {last_games_info.away_team_results.indexOf(payload)}/>
    })
    
    return (
        <div className={classes.analysis_block_table}>
            <div className={classes.analysis_block_head}>Последние матчи команд</div>
            <ToggleTeamButton   names_of_teams = {names_of_teams}
                                setTeam = {setTeam}
                                team = {team} />
            <div className={classes.last_game_block_row} >
                <div className={classes.last_games_block_date_cell}>
                    <span className={classes.before} />
                    <span>Дата</span>
                </div>
                <div className={classes.last_games_block_teams_name_cell}>
                    <span className={classes.before} />
                    Матч
                </div>
                <div className={classes.last_games_block_score_cell}>
                    <span className={classes.before} />
                    Счет
                </div>
                <div className={classes.last_games_block_cell}>
                    <span className={classes.before} />
                    Ож. исход
                </div>
                <div className={classes.last_games_block_cell}>
                    <span className={classes.before} />
                    Ож. тотал
                </div>
                <div className={classes.last_games_block_cell}>
                    <span className={classes.before} />
                    <span className={classes.inner}>К-т</span>
                </div>
            </div>
            {team === 'home' && home_team_last_games}
            {team === 'away' && away_team_last_games}
        </div>
    )
}

type LastMatchBlockRowPropsType = {
    payload: InfoAboutMatchType
}

const LastMatchesBlockRow: React.FC<LastMatchBlockRowPropsType> = ({ payload }) => {
    return (
        <div className={classes.last_game_block_row}>
            <div className={classes.last_games_block_date_cell}>
                <span className={classes.before} />
                <span>{payload.date_of_match}</span>
            </div>
            <div className={classes.last_games_block_team_cell}>
                <span>{payload.home_team}</span>
                <span>{payload.away_team}</span>
            </div>
            <div className={classes.last_games_block_score_cell}>
                <span className={classes.before} />
                {payload.score}
            </div>
            <div className={classes.last_games_block_cell}>
                <span className={classes.before} />
                {payload.expected_result}
            </div>
            <div className={classes.last_games_block_cell}>
                <span className={classes.before} />
                {payload.expected_total}
            </div>
            <div className={classes.last_games_block_cell}>
                <span className={classes.before} />
                {payload.opp_power}
            </div>
        </div>
    )
}

export default LastMatchesBlock;