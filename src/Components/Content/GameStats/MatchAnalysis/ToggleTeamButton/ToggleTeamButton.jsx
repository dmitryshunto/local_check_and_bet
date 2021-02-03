import React from 'react';
import classes from '../MatchAnalysis.module.css'

const ToggleTeamButton = ({team, setTeam, names_of_teams}) => {
    
    let team1_button_class_name = classes.toggle_team_button + ' ';
    let team2_button_class_name = classes.toggle_team_button + ' ';

    if (team === 'home') {
        team1_button_class_name = team1_button_class_name + classes.toggle_team_button_active;
    } else {
        team2_button_class_name = team2_button_class_name + classes.toggle_team_button_active;
    }

    return (
        <div className={classes.last_game_block_row}>
            <div className={team1_button_class_name} onClick={() => setTeam('home')}>
                <span className={classes.before} />
                <span>{names_of_teams[0]}</span>
            </div>
            <div className={team2_button_class_name} onClick={() => setTeam('away')}>
                <span className={classes.before} />
                <span>{names_of_teams[1]}</span>
            </div>
        </div>
    )
}

export default ToggleTeamButton;
