import React from 'react'
import classes from './../BetBlock.module.css'
import {OddBlockType} from '../../../../../../HOC/withSelectionAddedBets'
import OddItem from './OddItem'

type SelectedBetArgumentType = {
    odd: number
    odd_type: string
} 

type PropsTypes = {
    market: string
    odd_blocks: Array<OddBlockType>
    selectBet: (bet: SelectedBetArgumentType) => void
    oddBlocksClasses: Array<string>
    basic_total: number
}

const TwoWayBetBlock: React.FC<PropsTypes> = ({ market, odd_blocks, selectBet, oddBlocksClasses, basic_total}) => {        
    
    const odd_items = odd_blocks.map((odd_block, index) => <OddItem oddClassName = {oddBlocksClasses[index]} 
                                                                    selectBet = {selectBet}
                                                                    odd_block = {odd_block}
                                                                    key = {index}/>)
    return (
        <div className={classes.two_way_bet_block}>
            <div className={classes.market_head}>
                <span>{market}</span>
            </div>
            <div className = {classes.over_under_line}>
                <div></div>
                <div>{market === 'handicap' ? '1' : 'больше'}</div>
                <div>{market === 'handicap' ? '2' : 'меньше'}</div>
            </div>
            <div className={classes.market_content}>
                <div className = {classes.odd_type_block}>{market === 'handicap' ? 'Ф(0)' : basic_total}</div>
                {odd_items}
            </div>
        </div>
    )
}

export default TwoWayBetBlock