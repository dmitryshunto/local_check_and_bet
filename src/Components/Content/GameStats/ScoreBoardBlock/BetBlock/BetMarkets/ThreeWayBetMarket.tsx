import React from 'react'
import classes from './../BetBlock.module.css'
import {OddBlockType} from './../../../../../../HOC/withSelectionAddedBets'
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
}

const ThreeWayBetBlock: React.FC<PropsTypes> = ({ market, odd_blocks, selectBet, oddBlocksClasses}) => {        
    
    const odd_items = odd_blocks.map((odd_block, index) => <OddItem oddClassName = {oddBlocksClasses[index]} 
                                                                    selectBet = {selectBet}
                                                                    odd_block = {odd_block}
                                                                    key = {odd_block.odd_type_for_UI}/>)
    return (
        <div className={classes.three_way_bet_block}>
            <div className={classes.market_head}>
                <span>{market}</span>
            </div>
            <div className={classes.market_content}>
                {odd_items}
            </div>
        </div>
    )
}

export default ThreeWayBetBlock