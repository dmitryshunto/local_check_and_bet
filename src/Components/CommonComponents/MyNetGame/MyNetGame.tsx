import classes from './MyNetChampionship.module.css'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { MyNetGameType, my_net_kinds_of_bet, MyNetPredictionKindOfBetType, Kinds_of_bet_type } from '../../../redux/my_net_main_page_reducer'
import cn from 'classnames'
import { get_book_names_from_market_name, get_odd_types_and_values_from_market, get_text_selection_and_condition, isBetInArrayOfBets, return_bet_object } from '../../../CommonFunctions/typed_functions'
import { BetType, MarketType } from '../../../redux/betReducer'

type MyNetGame = {
    data: MyNetGameType
    selectBetTC: (bet: BetType) => void
    bets: [] | BetType[]
}

const MyNetGame: React.FC<MyNetGame> = (props) => {
    const kinds_of_bet_items = my_net_kinds_of_bet.map((kind_of_bet, index) => {
        const payload: MyNetPredictionKindOfBetType | undefined = props.data[kind_of_bet]
        if (payload) {
            return (
                <MyNetGameKindOfBet key={index}
                                    bets = {props.bets}
                                    db_name = {props.data.db_name}
                                    game_id = {props.data.game_id}
                                    date_of_match = {props.data.date_of_match}
                                    data = {payload}
                                    kind_of_bet={kind_of_bet}
                                    selectBetTC = {props.selectBetTC}
                                    home_team = {props.data.home_team_name}
                                    away_team = {props.data.away_team_name} />
            )
        }
    })
    return (
        <div className={classes.my_net_game}>
            <div className={classes.my_net_game_teams_block}>
                <NavLink to={`/game_stats/${props.data.db_name}/${props.data.game_id}`}>
                    {`${props.data.home_team_name} - ${props.data.away_team_name}`}
                </NavLink>
            </div>
            <div className={classes.my_net_kind_of_bet_items}>
                {kinds_of_bet_items}
            </div>
        </div>
    )
}


type KOF = {
    data: MyNetPredictionKindOfBetType
    kind_of_bet: Kinds_of_bet_type
    selectBetTC: (bet: BetType) => void
    db_name: string
    game_id: number
    date_of_match: string
    bets: [] | BetType[]
    home_team: string
    away_team: string
}



const MyNetGameKindOfBet: React.FC<KOF> = ({kind_of_bet, db_name, game_id, date_of_match, ...props}) => {
    let score = `${props.data.home_team_scored} - ${props.data.away_team_scored}`
    if (props.data.home_team_scored === null || props.data.away_team_scored === null) {
        score = ''
    }
    
    const market: MarketType = 'main_outcomes'
    
    const bet_obj_creator = return_bet_object(kind_of_bet, db_name, market, game_id, date_of_match, props.home_team, props.away_team)

    const odd_types_and_values = get_odd_types_and_values_from_market(market)
    let bet_names = get_book_names_from_market_name(market)

    const odd_items = odd_types_and_values.map((obj, index) => {
        const odd = props.data.book[bet_names[index]]
        const bet = bet_obj_creator(obj.value, obj.odd_type, props.data.book[bet_names[index]])
        const with_conditions_classes = obj.odd_type === 'x' ? null
                                                             : [get_text_selection_and_condition(odd, props.data.outcome_probability[obj.odd_type], classes.red_text_selection, classes.green_text_selection)]

        return <ItemWithTextSelection cb = {() => props.selectBetTC(bet)}
                                      key = {index}
                                      bet = {bet}
                                      bets = {props.bets}
                                      selected_bet_cn = {classes.selected_bet}
                                      value={odd}
                                      with_conditions_classes={with_conditions_classes}
                                      without_condition_classes={[classes.my_net_kinds_of_bet_cell]} />
    })


    return (
        <div className={classes.my_net_kinds_of_bet_row}>
            <div className={classes.my_net_kinds_of_bet_cell}>{`${kind_of_bet} (${props.data.basic_total})`}</div>
            {odd_items}
            <div className={classes.my_net_kinds_of_bet_cell}>{score}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{props.data.expected_home_team}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{props.data.expected_away_team}</div>
            <ItemWithTextSelection value={props.data.expected_result}
                with_conditions_classes={[{ className: props.data.expected_result > 1.5 ? classes.green_text_selection : classes.red_text_selection, 
                                            condition: props.data.expected_result > 1.5 || props.data.expected_result < -1.5}]}
                without_condition_classes={[classes.my_net_kinds_of_bet_cell]} />
            <ItemWithTextSelection value={props.data.outcome_probability.home}
                with_conditions_classes={[get_text_selection_and_condition(props.data.book.w1, props.data.outcome_probability.home, classes.red_text_selection, classes.green_text_selection)]}
                without_condition_classes={[classes.my_net_kinds_of_bet_cell]} />
            <div className={classes.my_net_kinds_of_bet_cell}>{props.data.outcome_probability.x}</div>
            <ItemWithTextSelection value={props.data.outcome_probability.away}
                with_conditions_classes={[get_text_selection_and_condition(props.data.book.w2, props.data.outcome_probability.away, classes.red_text_selection, classes.green_text_selection)]}
                without_condition_classes={[classes.my_net_kinds_of_bet_cell]} />
            <ItemWithTextSelection value={props.data.expected_total}
                with_conditions_classes = {[ {className: props.data.total_probability.TO > 0.65 ? classes.green_text_selection : classes.red_text_selection,
                                              condition: props.data.total_probability.TO > 0.65 || props.data.total_probability.TU > 0.65} ] }
                without_condition_classes={[classes.my_net_kinds_of_bet_cell]} />
            <ItemWithTextSelection value={props.data.total_probability.TO}
                with_conditions_classes={[{className: classes.green_text_selection, condition: props.data.total_probability.TO >= 0.65}]}
                without_condition_classes={[classes.my_net_kinds_of_bet_cell]} />
            <ItemWithTextSelection value={props.data.total_probability.TU}
                with_conditions_classes = {[{condition: props.data.total_probability.TU >= 0.65, className: classes.red_text_selection}]}
                without_condition_classes={[classes.my_net_kinds_of_bet_cell]} />
            <div className={classes.my_net_kinds_of_bet_cell}>{props.data.total_probability.BACK}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{`${props.data.outcome_bet_team || ''} ${props.data.handicap || ''}`}</div>
            <div className={classes.my_net_kinds_of_bet_cell}>{`${props.data.over_under_bet_type || ''} ${props.data.over_under_bet_total || ''}`}</div>
        </div>
    )
}


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

export const ItemWithTextSelection: React.FC<ItemWithTextSelectionType> = (props) => {
    
    const cn_object: Cn_object_type = {}
    if(props.without_condition_classes) {
        props.without_condition_classes.forEach(cl => {
            cn_object[cl] = true
        })
    }
    if(props.bet && props.bets && props.selected_bet_cn) {
        cn_object[props.selected_bet_cn] = isBetInArrayOfBets(props.bet, props.bets)
    }
    if(props.with_conditions_classes) {
        for(let with_condition_class of props.with_conditions_classes) {
            if(with_condition_class.className) cn_object[with_condition_class.className] = with_condition_class.condition
        }
    } 
    
    return (
        <div onClick = {props.cb} className={
            cn(cn_object)
        }>{props.value}</div>
    )
}

export default MyNetGame