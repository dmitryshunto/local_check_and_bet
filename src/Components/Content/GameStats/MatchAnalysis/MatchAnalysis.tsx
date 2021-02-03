import React from 'react';
import classes from './MatchAnalysis.module.css';
import AnalysisBlock from './AnalysisBlock/AnalysisBlock';
import LastMatchesBlock from './LastMatchesBlock/LastMatchesBlock';
import { InfoAboutLastMatchesItemType, AnalysisBlockItemType } from '../../../../redux/game_stats_reducer'

type PropsType = {
    analysis_block: AnalysisBlockItemType
    last_games_info: InfoAboutLastMatchesItemType
    names_of_teams: string[]
}

const MatchAnalysis: React.FC<PropsType> = React.memo(({ analysis_block, last_games_info, names_of_teams }) => {

    return (
        <div className={classes.analysis_block_table_container}>
            <AnalysisBlock analysis_block={analysis_block} names_of_teams={names_of_teams} />
            <LastMatchesBlock last_games_info={last_games_info} names_of_teams={names_of_teams} />
        </div>
    )
})

export default MatchAnalysis;
