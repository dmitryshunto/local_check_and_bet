import React from 'react';
import {BetType} from './../redux/betReducer'; 

export type SelectedBetArgumentType = {
    odd: number
    odd_type: string
} 

export type OddBlockType = {
    odd: number
    odd_type: string
    odd_type_for_UI?: string
}

type PropsTypes = {
    classes: any
    odd_className: string
    addedBets: Array<BetType> | []
    name_of_championship: string
    names_of_teams: Array<string>
    kind_of_bet: string
    market: string
    odd_blocks: Array<OddBlockType>
    filterAddedBetsArray: (addedBet: BetType,
                           names_of_teams: Array<string>,
                           kind_of_bet: string, 
                           market: string) => Array<BetType> | null
    addBet: (bet: BetType) => void
    removeBet: (bet: BetType) => void
    index: number
    basic_total: number,
    date_of_match: string
}

const withAddedBets = (props: any) => (WrappedComponent: any) => {
    let {classes, odd_className, addedBets, name_of_championship, names_of_teams, date_of_match, odd_blocks, 
           kind_of_bet, market, filterAddedBetsArray, addBet, removeBet, index}: PropsTypes = props
    
    // проверяем есть ли добавляемая ставка в массиве добавленных ставок
    const newAddedBetsType = addedBets?.filter(addedBet => filterAddedBetsArray(addedBet, names_of_teams, kind_of_bet, market))[0]
    
    // классы, которые передаются оборачиваемым компонентам
    const odd_blocks_classes = odd_blocks.map(odd_block => {
        if(newAddedBetsType) {
            return odd_block.odd_type !== newAddedBetsType.odd_type
            ? classes[odd_className]
            : classes[odd_className] + ' ' + classes.odd_button_active
        } else return classes[odd_className]
    })    
    
    const selectBet = (selectedBet: SelectedBetArgumentType) => {
        let bet = {
            date_of_match,
            name_of_championship,
            kind_of_bet,
            market,
            name_of_team1: names_of_teams[0],
            name_of_team2: names_of_teams[1],
            odd_type: selectedBet.odd_type,
            odd: selectedBet.odd
        }
        
        if(!newAddedBetsType) {
            addBet(bet)
        } else {
            if (newAddedBetsType.odd_type === selectedBet.odd_type) {
                removeBet(newAddedBetsType)
            } else {
                removeBet(newAddedBetsType)
                addBet(bet)
            }    
        } 
    }
    return (
        <WrappedComponent {...props} 
                          selectBet = {selectBet}
                          oddBlocksClasses = {odd_blocks_classes}
                          key = {index}/>
    )

}

export default withAddedBets