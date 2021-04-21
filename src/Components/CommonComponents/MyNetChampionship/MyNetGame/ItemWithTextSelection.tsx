import React from 'react'
import cn from 'classnames'

import { isBetInArrayOfBets } from '../../../../CommonFunctions/typed_functions'
import { BetType } from '../../../../redux/betReducer'

type ConditionsType = {
    condition: boolean | null
    className: string | null
}

type ItemWithTextSelectionType = {
    value: number | null | string
    with_conditions_classes?: Array<ConditionsType> | null
    without_condition_classes?: string[] | []
    selected_bet_cn?: string
    bet?: BetType
    bets?: [] | BetType[]
    cb?: () => void
}

type Cn_object_type = {
    [key: string]: boolean | null
}

export const ItemWithTextSelection: React.FC<ItemWithTextSelectionType> = React.memo((props) => {
    
    const cn_object: Cn_object_type = {}
    if(props.bet && props.bets && props.selected_bet_cn) {
        cn_object[props.selected_bet_cn] = isBetInArrayOfBets(props.bet, props.bets)
    }
    if(props.without_condition_classes) {
        props.without_condition_classes.forEach(cl => {
            cn_object[cl] = true
        })
    }
    if(props.with_conditions_classes) {
        for(let with_condition_class of props.with_conditions_classes) {
            if(with_condition_class.className) cn_object[with_condition_class.className] = with_condition_class.condition
        }
    } 
    
    return (
        <div onClick = {props.cb} className={
            cn(cn_object)
        }>{props.value ? props.value : '-'}</div>
    )
})

// export default MyNetGame