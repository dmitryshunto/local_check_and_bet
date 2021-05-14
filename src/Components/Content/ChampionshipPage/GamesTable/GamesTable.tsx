import React from 'react'
import classes from './GamesTable.module.css'
import { MyNetGameType } from '../../../../redux/my_net_main_page_reducer';
import { BetType } from '../../../../redux/betReducer';
import { GamesTable } from '../../../CommonComponents/MyNetChampionship/MyNetChampionship';
import { Empty } from 'antd';

type GamesBlockProps = {
    games?: MyNetGameType[]
    selectBetTC: (bet: BetType) => void
    bets: [] | BetType[]
    db_name: string
}

const GamesBlock: React.FC<GamesBlockProps> = ({ games, ...props }) => {
    return (
        <div className={classes.games_block}>
            <h3>Next matches</h3>
            {!games && <Empty />}
            {games && <div className={classes.games_table}>
                <GamesTable predictions={games}
                    selectBetTC={props.selectBetTC}
                    bets={props.bets}
                    db_name={props.db_name} />

            </div>

            }
        </div>
    )
}

export default GamesBlock