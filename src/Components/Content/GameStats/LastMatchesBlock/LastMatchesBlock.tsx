import React from 'react';
import { useState } from 'react';
import ToggleTeamButton from './ToggleTeamButton/ToggleTeamButton';
import classes from './LastMatchesBlock.module.css'
import common_classes from '../GameStats.module.css' 
import { InfoAboutLastMatchesItemType, InfoAboutMatchType } from '../../../../redux/game_stats_reducer'
import { HomeAwayItemsType } from '../../../../redux/redux'
import Table, { ColumnsType } from 'antd/lib/table';

type PropsType = {
    names_of_teams: Array<string>
    last_games_info: InfoAboutLastMatchesItemType
}

const columns: ColumnsType<InfoAboutMatchType> = [
    {
        title: 'Date',
        dataIndex: 'date_of_match'
    },
    {
        title: 'Match',
        render: (value, record) => {
            return (
                <span>{`${record.home_team} - ${record.away_team}`}</span>
            )
        }
    },
    {
        title: 'Score',
        dataIndex: 'score'
    },
    {
        title: 'Ex. result',
        dataIndex: 'expected_result'
    },
    {
        title: 'Ex. total',
        dataIndex: 'expected_total'
    },
    {
        title: 'Book Line',
        children: [
            {
                title: 'W1',
                render: (v, r) => r['book_line']['w1']
            },
            {
                title: 'X',
                render: (v, r) => r['book_line']['x']
            },
            {
                title: 'W2',
                render: (v, r) => r['book_line']['w2']
            }
        ]
    } 
]

const LastMatchesBlock: React.FC<PropsType> = ({ last_games_info, names_of_teams }) => {
    let [team, setTeam] = useState<HomeAwayItemsType>('home');
    
    const data = last_games_info[`${team}_team_results`]
    
    return (
        <div className={classes.last_matches_block}>
            <div className={common_classes.block_header}>Teams last matches</div>
            <ToggleTeamButton   names_of_teams = {names_of_teams}
                                setTeam = {setTeam}
                                team = {team} />
            <Table columns = {columns} dataSource = {data} rowKey = {r => r['date_of_match']} size = {'small'}/>
            
        </div>
    )
}

export default LastMatchesBlock;