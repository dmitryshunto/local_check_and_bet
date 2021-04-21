import React from 'react'
import { actions, MyNetChampionship, MyNetGameType, my_net_kinds_of_bet } from '../../../redux/my_net_main_page_reducer'
import classes from './MyNetChampionship.module.css'
import { Link } from 'react-router-dom'
import { ItemWithTextSelection } from './MyNetGame/ItemWithTextSelection'
import { BetType, MarketType } from '../../../redux/betReducer'
import Table, { ColumnsType } from 'antd/lib/table'
import { Button, Col, Collapse, Empty, Row } from 'antd'
import { get_book_names_from_market_name, get_odd_types_and_values_from_market, get_text_selection_and_condition, return_bet_object, transform_name_for_ui } from '../../../CommonFunctions/typed_functions'
import { CSSTransition } from 'react-transition-group'
import { getTodayDate } from '../../../CommonFunctions/commonFunctions'

type MyNetChampionshipType = {
    data: MyNetChampionship
    date_of_match: string
    selectBetTC: (bet: BetType) => void
    bets: [] | BetType[]
    changeChampionshipCheckedStatus: typeof actions.changeChampionshipCheckedStatus
}

export type RenderFunction<T> = (value: any, record: T, index: number) => React.ReactNode

export type CustomColumnsType<T> = {
    title: string
    key: string | number
    width?: number
    render: RenderFunction<T>
}

const create_odds_columns = (selectBetTC: (bet: BetType) => void, bets: BetType[]) => {
    const result: CustomColumnsType<MyNetGameType>[] = []
    const market: MarketType = 'main_outcomes'
    const odd_types_and_values = get_odd_types_and_values_from_market(market)
    const bet_names = get_book_names_from_market_name(market)

    bet_names.forEach((bet_name, index) => {
        // функция создатель функции render отрисовки для массива columns компонента Table
        const create_render_function = (selectBetTC: (bet: BetType) => void, bets: BetType[]) => {
            return (game: MyNetGameType) => {
                const items = [] // jsx элементы возвращаемые функцией render
                for (let kind_of_bet of my_net_kinds_of_bet) {
                    if (kind_of_bet in game) {
                        const bet_obj_creator = return_bet_object(kind_of_bet, game.db_name, market, game.game_id,
                            game.date_of_match, game.home_team_name, game.away_team_name)

                        const data = game[kind_of_bet]!
                        const obj = odd_types_and_values[index]
                        const odd = data.book[bet_names[index]]

                        const bet = bet_obj_creator(obj.value, obj.odd_type, data.book[bet_names[index]])
                        const with_conditions_classes = obj.odd_type === 'x' ? null
                            : [get_text_selection_and_condition(odd, data.outcome_probability[obj.odd_type], classes.red_text_selection, classes.green_text_selection)]

                        items.push(
                            <div key={kind_of_bet} >
                                <ItemWithTextSelection cb={() => selectBetTC(bet)}
                                    key={kind_of_bet}
                                    bet={bet}
                                    bets={bets}
                                    selected_bet_cn={classes.selected_bet}
                                    value={odd}
                                    with_conditions_classes={with_conditions_classes} />
                            </div>)


                    }
                }
                return { children: items}
            }
        }
        result.push({
            title: bet_name.toUpperCase(),
            render: create_render_function(selectBetTC, bets),
            key: bet_name.toUpperCase(),
            width: 65
        })
    })
    return result
}

const create_prediction_columns = () => {
    const result: CustomColumnsType<MyNetGameType>[] = []
    const columns_names = [
        'Score', 'Kind of bet', 'Basic Total', 'Ex. res.', 'Ex. W1', 'Ex. X', 'Ex. W2', 'Ex. tot.', 'Ex. TO',
        'Ex. TU', 'Ex. BACK', 'Out. Bet', 'Tot. Bet'
    ] as const
    columns_names.forEach((name) => {
        //обявление функции отрисовки для массива columns компонента Table
        let width
        const render = (game: MyNetGameType) => {
            // jsx элементы возвращаемые функцией render
            const items = []
            for (let kind_of_bet of my_net_kinds_of_bet) {
                if (kind_of_bet in game) {
                    const data = game[kind_of_bet]!
                    let value, with_conditions_classes
                    // switch для определения нужных классов и значения, которое необходимо отрисовать
                    switch (name) {
                        case 'Ex. res.': {
                            value = data.expected_result
                            with_conditions_classes = [{
                                className: data.expected_result > 1.5 ? classes.green_text_selection : classes.red_text_selection,
                                condition: data.expected_result > 1.5 || data.expected_result < -1.5
                            }]
                            break
                        } case 'Ex. tot.': {
                            value = data.expected_total
                            with_conditions_classes = [{
                                className: data.total_probability.TO >= 0.65 ? classes.green_text_selection : classes.red_text_selection,
                                condition: data.total_probability.TO >= 0.65 || data.total_probability.TU >= 0.65
                            }]
                            break
                        } case 'Ex. W1': {
                            value = data.outcome_probability.home
                            with_conditions_classes = [get_text_selection_and_condition(data.book.w1, data.outcome_probability.home, classes.red_text_selection, classes.green_text_selection)]
                            break
                        } case 'Ex. X': {
                            value = data.outcome_probability.x
                            break
                        } case 'Ex. W2': {
                            value = data.outcome_probability.away
                            with_conditions_classes = [get_text_selection_and_condition(data.book.w2, data.outcome_probability.away, classes.red_text_selection, classes.green_text_selection)]
                            break
                        } case 'Ex. TO': {
                            value = data.total_probability.TO
                            with_conditions_classes = [{ className: classes.green_text_selection, condition: data.total_probability.TO >= 0.65 }]
                            break
                        } case 'Ex. TU': {
                            value = data.total_probability.TU
                            with_conditions_classes = [{ condition: data.total_probability.TU >= 0.65, className: classes.red_text_selection }]
                            break
                        } case 'Ex. BACK': {
                            value = data.total_probability.BACK
                            break
                        } case 'Out. Bet': {
                            value = `${data.outcome_bet_team || ''} ${data.handicap !== null ? data.handicap : ''}`
                            if (!data.outcome_bet_team) value = ''
                            break
                        } case 'Tot. Bet': {
                            value = `${data.over_under_bet_type || ''} ${data.over_under_bet_total || ''}`
                            if (!data.over_under_bet_type) value = ''
                            break
                        } case 'Score': {
                            value = `${data.home_team_scored} - ${data.away_team_scored}`
                            if (data.home_team_scored === null || data.away_team_scored === null) {
                                value = ''
                            }
                            break
                        } case 'Kind of bet': {
                            value = `${transform_name_for_ui(kind_of_bet)}`
                            break
                        } case 'Basic Total': {
                            value = data.basic_total
                            break
                        }
                    }
                    items.push(
                        <ItemWithTextSelection value={value}
                            key={kind_of_bet}
                            with_conditions_classes={with_conditions_classes}
                        />
                    )
                }

            }
            return { children: items }
        }
        if (name === 'Out. Bet' || name === 'Tot. Bet') width = 250
        if (name === 'Score' || name === 'Ex. BACK') width = 150
        if (name === 'Kind of bet') width = 200
        if (name === 'Basic Total') width = 100
        result.push({ title: name, render, width, key: name })
    })
    return result
}

const { Panel } = Collapse

const classNames = {
    enter: classes.my_node_enter,
    enterActive: classes.my_node_enter_active,
    exit: classes.my_node_exit,
    exitActive: classes.my_node_exit_active,
}

const MyNetChampionshipTable: React.FC<MyNetChampionshipType> = React.memo((props) => {
    let button_content, button_type: 'primary' | undefined
    if (props.data.checked) {
        button_content = 'checked'
        button_type = 'primary'
    } else {
        button_content = 'check'
    }

    return (
        <div className={classes.my_net_championship_table}>
            <Row style = {{marginBottom: '1%'}}>
                <Col span = {4}>
                    <Link to={`/championships/${props.data.db_name}`}>{`${props.data.country_name} ${props.data.name_of_championship}`}</Link>
                </Col>
                {getTodayDate() <= props.date_of_match &&
                <Col span = {2}>
                    <Button type={button_type} onClick={
                        () => { props.changeChampionshipCheckedStatus(props.data.db_name, props.date_of_match) }
                    }>{button_content}</Button>
                </Col>}
            </Row>
            <CSSTransition
                in={!props.data.checked}
                unmountOnExit
                classNames={{ ...classNames }}
                timeout={300}
            >
                <GamesTable selectBetTC={props.selectBetTC}
                    bets={props.bets}
                    predictions={props.data.predictions}
                    db_name={props.data.db_name} />

            </CSSTransition>
        </div >

    )
})

type GamesTableType = {
    selectBetTC: (bet: BetType) => void
    bets: BetType[]
    predictions: MyNetGameType[]
    db_name: string
}

export const GamesTable: React.FC<GamesTableType> = (props) => {
    const odds_columns = create_odds_columns(props.selectBetTC, props.bets)
    const prediction_columns = create_prediction_columns()

    const columns: ColumnsType<MyNetGameType> = [
        {
            title: 'Match',
            width: 450,
            key: 'Match',
            render: (v, game) => {
                return <Link to={`/game_stats/${props.db_name}/${game.game_id}`} >{`${game.home_team_name} - ${game.away_team_name}`}</Link>
            }
        }, ...odds_columns,
        ...prediction_columns
    ]
    if (!props.predictions.length) return <Empty />
    return <Table columns={columns} rowKey={record => record['home_team_name']} dataSource={props.predictions}
        size={'middle'} pagination={false} scroll={{ x: true, y: 500 }} />
}

export default MyNetChampionshipTable


