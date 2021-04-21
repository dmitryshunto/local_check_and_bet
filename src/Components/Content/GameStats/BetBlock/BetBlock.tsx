import React from 'react';
import classes from './BetBlock.module.css'
import common_classes from '../GameStats.module.css'
import BetMarket from './BetMarkets/BetMarket'
import { BetItemType, ScoreBoardBetBlockType, TwoWayBetsItem } from '../../../../redux/game_stats_reducer'
import { NewKindOfBet } from '../../../../redux/redux'
import { BetType } from '../../../../redux/betReducer'

type OwnPropsTypes = {
    bet_block: ScoreBoardBetBlockType
    addedBets: BetType[] | []
    kind_of_bet: NewKindOfBet
    date_of_match: string
    selectBetTC: (bet: BetType) => void
    game_id: number
    db_name: string
    home_team: string
    away_team: string
}

const create_all_bet_markets = (props: OwnPropsTypes) => {
    const result = []

    const bet_markets_types = Object.keys(props.bet_block) // two_way_bets || three_way_bets

    for (let bet_market_type of bet_markets_types) {
        if (props.bet_block[bet_market_type]) {
            let bet_markets: BetMarketsElemsType = []
            const bet_markets_names = Object.keys(props.bet_block[bet_market_type]!)
            for (let bet_market_name of bet_markets_names) {
                const data = props.bet_block[bet_market_type]![bet_market_name]
                if (data) {
                    const items = create_bet_markets(data, props.kind_of_bet, props.date_of_match, props.addedBets, props.selectBetTC,
                        props.game_id, props.db_name, bet_market_name, bet_market_type, props.home_team, props.away_team)
                    bet_markets = [...bet_markets, ...items]
                }
            }
            result.push(bet_markets)
        }
    }
    return result
}

const create_bet_markets = (data: BetItemType[] | TwoWayBetsItem[], kind_of_bet: NewKindOfBet, date_of_match: string, bets: BetType[] | [],
    selectBetTC: (bet: BetType) => void, game_id: number, db_name: string, bet_market: string, bet_market_type: string,
    home_team: string, away_team: string) => {
    const result = []
    if (bet_market_type === 'two_way_bets') {
        for (let i = 0; i < data.length; i++) {
            const with_over_line = i > 0 ? false : true
            //@ts-ignore
            const elem = create_bet_market(data[i], kind_of_bet, date_of_match, bets, selectBetTC, game_id, db_name, bet_market, with_over_line, `${bet_market}${i}`,
                home_team, away_team)
            result.push(elem)
        }
    }
    if(bet_market_type === 'three_way_bets') {
        //@ts-ignore
        const elem = create_bet_market(data, kind_of_bet, date_of_match, bets, selectBetTC, game_id, db_name, bet_market, true, bet_market, home_team, away_team)
        result.push(elem)
    }
    return result
}

type BetMarketsElemsType = ReturnType<typeof create_bet_markets>

const create_bet_market = (data: BetItemType[], kind_of_bet: NewKindOfBet, date_of_match: string, bets: BetType[] | [],
    selectBetTC: (bet: BetType) => void, game_id: number, db_name: string, bet_market: string, with_over_line: boolean, key: number,
    home_team: string, away_team: string) => {
    return <BetMarket data={data}
        key = {key}
        kind_of_bet={kind_of_bet}
        date_of_match={date_of_match}
        bets={bets}
        selectBetTC={selectBetTC}
        game_id={game_id}
        db_name={db_name}
        //@ts-ignore
        market={bet_market}
        with_head_line={with_over_line}
        with_over_under_line={!with_over_line} 
        home_team = {home_team}
        away_team = {away_team}/>
}

const BetBlock: React.FC<OwnPropsTypes> = (props) => {
    const bet_markets = create_all_bet_markets(props)
    return (
        <div className={classes.bet_block}>
            <div className={common_classes.block_header}>
                Book Line
            </div>
            {bet_markets[1]}
            {bet_markets[0]}
        </div>
    )
}

export default BetBlock