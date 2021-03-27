import React from 'react'
import classes from './GamesTable.module.css'
import { MyNetGameType } from '../../../../redux/my_net_main_page_reducer';
import MyNetGame from '../../../CommonComponents/MyNetGame/MyNetGame';
import { BetType } from '../../../../redux/betReducer';

type GamesBlockProps = {
    games: MyNetGameType[]
    selectBetTC: (bet: BetType) => void
    bets: [] | BetType[]
}

const GamesBlock: React.FC<GamesBlockProps> = ({games, ...props}) => {
    let items = games.map((game: MyNetGameType, index: number) => <MyNetGame    key = {index}
                                                                                bets = {props.bets} 
                                                                                data = {game}
                                                                                selectBetTC = {props.selectBetTC}
                                                                                
     />)
    return (
        <div className={classes.games_block}>
            <h3>Следующие матчи</h3>
            <table className={classes.games_table}>
                <tbody>
                    {items}
                </tbody>
            </table>
        </div>
    )
}

export default GamesBlock