import React from 'react'
import {SelectedBetArgumentType, OddBlockType} from './../../../../../../HOC/withSelectionAddedBets'
import { withRenderByCondition } from '../../../../../../HOC/withPreloader'
import EmptyOdd from '../../../../../CommonComponents/EmptyOdd'

type PropsTypes = {
    oddClassName: string
    selectBet: (bet: SelectedBetArgumentType) => void
    odd_block: OddBlockType
}

const OddItem: React.FC<PropsTypes> = ({oddClassName, selectBet, odd_block}) => {
    // ниже выполняется проверка на наличие в объекте odd_block свойства odd_type_for_UI 
    // если такое свойство имеется, то отображаем его, иначе отбражаем свойство odd
    return (
        <div className={oddClassName} onClick = {() => selectBet({odd: odd_block.odd, odd_type: odd_block.odd_type})}>
            {Object.keys(odd_block).indexOf('odd_type_for_UI') !== -1 ? odd_block.odd_type_for_UI : odd_block.odd}      
        </div> 
    )
}

export default withRenderByCondition(EmptyOdd, 'odd_block', 'odd')(OddItem)
