import React from 'react'
import  classes from './ToggleButton.module.css'
import {HomeAwayItemsType, KindOfBetType, NewKindOfBet} from '../../../redux/redux'
import { transform_name_for_ui } from '../../../CommonFunctions/typed_functions'

type PropsType = {
    kinds_of_bet: string[]
    selected_home_away?: HomeAwayItemsType
    set_selected_home_away?: any
    selected_kind_of_bet: KindOfBetType | NewKindOfBet
    set_selected_kind_of_bet: any
}

type Kinds = HomeAwayItemsType | KindOfBetType | NewKindOfBet

const ToggleButtons = ({kinds_of_bet, selected_home_away, set_selected_home_away, selected_kind_of_bet, set_selected_kind_of_bet}: PropsType) => {
    let toggle_buttons: any[] = []
    if(selected_home_away && set_selected_home_away) {
        const home_away_array: Array<Kinds> = ['home', 'away']
        home_away_array.forEach((home_away_item, index) => toggle_buttons.push(<ToggleButton selected = {selected_home_away}
                                                                                key = {index} 
                                                                                kind = {home_away_item}
                                                                                callback = {set_selected_home_away}
                                                                                content = {home_away_item}
                                                                                classes = {classes}/>))
    }
    kinds_of_bet?.forEach((kind_of_bet, index) => toggle_buttons.push(<ToggleButton selected = {selected_kind_of_bet}
                                                                          kind = {kind_of_bet}
                                                                          key = {index + 2}
                                                                          callback = {set_selected_kind_of_bet}
                                                                          content = {kind_of_bet}
                                                                          classes = {classes}/>))
    
    

    return (
        <div className = {classes.toogle_buttons}>
            {toggle_buttons}
        </div>
    )
}

type ToggleButtonItem = {
    selected: string
    kind: string
    callback: (selected: string) => void
    content: any
    classes: typeof classes
}

const ToggleButton = ({selected, kind, callback, content, classes}: ToggleButtonItem) => {
    return (
        <div className = {selected === kind ? classes.active_button : undefined} onClick = {() => callback(kind)} >{transform_name_for_ui(content)}</div>
    )
}

export default ToggleButtons