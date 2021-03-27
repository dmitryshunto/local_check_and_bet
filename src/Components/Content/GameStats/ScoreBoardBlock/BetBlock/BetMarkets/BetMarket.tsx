import React from 'react'
import classes from './../BetBlock.module.css'
import { BetType, MarketType } from '../../../../../../redux/betReducer'
import { BetItemType } from '../../../../../../redux/game_stats_reducer'
import { return_bet_object } from '../../../../../../CommonFunctions/typed_functions';
import { Kinds_of_bet_type } from '../../../../../../redux/my_net_main_page_reducer';
import { ItemWithTextSelection } from '../../../../../CommonComponents/MyNetGame/MyNetGame';

type PropsTypes = {
    data: BetItemType[]
    kind_of_bet: Kinds_of_bet_type
    date_of_match: string
    db_name: string
    market: MarketType
    game_id: number
    bets: BetType[] | []
    selectBetTC: (bet: BetType) => void
    with_head_line: boolean
    with_over_under_line?: boolean
    home_team: string
    away_team: string
}

const BetMarket: React.FC<PropsTypes> = ({ market, data, selectBetTC, with_head_line, ...props}) => {    
    const bet_obj_creator = return_bet_object(props.kind_of_bet, props.db_name, market, props.game_id, props.date_of_match,
        props.home_team, props.away_team)
    const odd_items = data?.map((item, index) => {
        let bet_value: null | number = null
        if(item.handicap) bet_value = item.handicap
        if(item.total) bet_value = item.total
        const bet = bet_obj_creator(bet_value, item.odd_type, item.odd)        
        return <ItemWithTextSelection cb = {() => selectBetTC(bet)}
                                      key = {index} 
                                      bet = {bet}
                                      bets = {props.bets}
                                      selected_bet_cn = {classes.selected_bet}
                                      value={item.odd_type_for_UI}
                                     />
    })
    let with_over_under_line
    if(!props.with_over_under_line) with_over_under_line = market === 'totals' || market === 'handicaps'
    return (
        <div className = {classes.bet_market}>
            {with_head_line &&
            <div className={classes.market_head}>
                <span>{market}</span>
            </div>
            }
            {with_over_under_line &&
            <div className = {classes.over_under_line}>
                <div></div>
                <div>{market === 'handicaps' ? '1' : 'over'}</div>
                <div>{market === 'handicaps' ? '2' : 'under'}</div>
            </div>
            }
            <div className={classes.market_content}>
                {odd_items.length === 2 && <div>{data[0].total || data[0].handicap}</div>}
                {odd_items}
            </div>
        </div>
    )
}

export default BetMarket