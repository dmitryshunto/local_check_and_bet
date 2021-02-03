import React, { useState } from 'react';
import classes from './../../MatchAnalysis/MatchAnalysis.module.css'
import ToggleTeamButton from '../ToggleTeamButton/ToggleTeamButton';
import {AnalysisBlockItemType} from '../../../../../redux/game_stats_reducer'
import {HomeAwayItemsType} from '../../../../../redux/redux'

type PropsTypes = {
    analysis_block: AnalysisBlockItemType
    names_of_teams: Array<string>
}

const AnalysisBlock: React.FC<PropsTypes> = ({ analysis_block, names_of_teams }) => {
    let [team, setTeam] = useState<HomeAwayItemsType>('home');
    const home_team_analysis_block = Object.keys(analysis_block.home_team_results).map(key => {
        let value = analysis_block.home_team_results[key];
        return <AnalysisBlockRow parameter={key}
            value={value}
            key={key} />
    })

    const away_team_analysis_block = Object.keys(analysis_block.away_team_results).map(key => {
        let value = analysis_block.away_team_results[key];
        return <AnalysisBlockRow parameter={key}
            value={value}
            key={key} />
    })
    
    return (
        <div className={classes.analysis_block_table}>
            <div className={classes.analysis_block_head}>Анализ выступлений команд</div>
            <ToggleTeamButton   names_of_teams = {names_of_teams}
                                setTeam = {setTeam}
                                team = {team} />
            {team === 'home' && home_team_analysis_block}
            {team === 'away' && away_team_analysis_block}
        </div>
    )
}

type AnalysisBlockRowPropsTypes = {
    parameter: string
    value: number
}

const AnalysisBlockRow: React.FC<AnalysisBlockRowPropsTypes> = ({ parameter, value }) => {
    return (
        <div className={classes.analysis_block_row}>
            <div className={classes.analysis_block_cell}>{parameter}</div>
            <div className={classes.analysis_block_cell}>{value}</div>
        </div>
    )
}

export default AnalysisBlock;
