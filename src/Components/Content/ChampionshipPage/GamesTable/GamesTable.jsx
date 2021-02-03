import React from 'react'
import GamesTableHead from '../../../CommonComponents/Game/GamesTableHead'
import classes from './GamesTable.module.css'
import Game from '../../../CommonComponents/Game/Game'

const GamesBlock = ({games, ...props}) => {
    
    const dates_of_prediction = Object.keys(games)

    const items = dates_of_prediction.map(date_of_prediction => {
        return <DaylyGamesBlock addedBets={props.addedBets}
            addBet={props.addBet}
            removeBet={props.removeBet}
            key={date_of_prediction}
            games={games[date_of_prediction]}
            basic_totals={props.basic_totals}
            name_of_championship={props.name_of_championship}
            date_of_prediction={date_of_prediction} />
    })

    return (
        <div className={classes.games_block}>
            <h3>Следующие матчи</h3>
            <table className={classes.games_table}>
                <GamesTableHead />
                <tbody>
                    {items}
                </tbody>
            </table>
        </div>
    )
}

const DaylyGamesBlock = ({date_of_prediction, games, ...props}) => {
    
    const items = games.map(game => {
        return <Game addedBets={props.addedBets}
                     addBet={props.addBet}
                     removeBet={props.removeBet}
                     key={game.games_id}
                     data={game}
                     basic_totals={props.basic_totals}
                     name_of_championship={props.name_of_championship}
                     date_of_prediction={date_of_prediction} />
    })

    return (
        <>
            <tr>
                <td colSpan = {15} className = {classes.date_line}>{date_of_prediction}</td>
            </tr>
            <tr>
                <td colSpan = {15} />
            </tr>
            {items}
        </>
    )
}

export default GamesBlock