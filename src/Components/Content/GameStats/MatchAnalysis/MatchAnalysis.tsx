import React from 'react';
import classes from './MatchAnalysis.module.css'
import LastMatchesBlock from './LastMatchesBlock/LastMatchesBlock';
import { InfoAboutLastMatchesItemType } from '../../../../redux/game_stats_reducer'

type PropsType = {
    last_games_info: InfoAboutLastMatchesItemType
    names_of_teams: string[]
}

const MatchAnalysis: React.FC<PropsType> = React.memo(({ last_games_info, names_of_teams }) => {

    return (
        <div className={classes.analysis_block_table_container}>
            <LastMatchesBlock last_games_info={last_games_info} names_of_teams={names_of_teams} />
        </div>
    )
})

export default MatchAnalysis;
