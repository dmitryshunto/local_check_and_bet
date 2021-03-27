import React from 'react'
import { withRenderByCondition } from '../../../../../../HOC/withPreloader'
import EmptyOdd from '../../../../../CommonComponents/EmptyOdd'

type PropsTypes = {
    odd_block: {
        odd_type_for_UI?: string
        odd: number | null
    }
}

const OddItem: React.FC<PropsTypes> = ({odd_block}) => {
    // ниже выполняется проверка на наличие в объекте odd_block свойства odd_type_for_UI 
    // если такое свойство имеется, то отображаем его, иначе отбражаем свойство odd
    return (
        <div>
            {Object.keys(odd_block).indexOf('odd_type_for_UI') !== -1 ? odd_block.odd_type_for_UI : odd_block.odd}      
        </div> 
    )
}

export default OddItem
