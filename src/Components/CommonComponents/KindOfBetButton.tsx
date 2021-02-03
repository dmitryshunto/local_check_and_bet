import React from 'react'

type PropsType = {
    kinds_of_bet: string[]
    set_kind_of_bet: (kind_of_bet: string) => void
    classes: any //объект стилей
}
const KindOfBetButtons: React.FC<PropsType> = ({kinds_of_bet, set_kind_of_bet, classes}) => {
    const kind_of_bet_buttons = kinds_of_bet?.map(kind_of_bet => <KindOfBetButton key = {kind_of_bet}
                                                                                 kind_of_bet = {kind_of_bet}
                                                                                 set_kind_of_bet = {set_kind_of_bet}/>)
    return (
        <div className = {classes.toggle}>
            {kind_of_bet_buttons}
        </div>
    )
}

type KindOfBetButtonPropsType = {
    kind_of_bet: string
    set_kind_of_bet: (kind_of_bet: string) => void
}

const KindOfBetButton: React.FC<KindOfBetButtonPropsType> = ({kind_of_bet, set_kind_of_bet}) => {
    return (
        <div onClick = {() => set_kind_of_bet(kind_of_bet)}>
            {kind_of_bet}
        </div>
    )
}

export default KindOfBetButtons