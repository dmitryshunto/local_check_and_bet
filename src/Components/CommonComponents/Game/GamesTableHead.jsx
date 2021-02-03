import React from 'react'
import classes from './Game.module.css'

const GamesTableHead = () => {
    return (
        <thead>
            <tr>
                <th rowSpan={2} className={classes.teams_block_head}>Команды</th>
                <th rowSpan={2} className={classes.kind_of_bet_head}>Вид</th>
                <th rowSpan={2} className={classes.prediction_score_block}>Счет</th>
                <th className={classes.odds_block} colSpan={3}>Линия</th>
                <th colSpan={9}>Прогнозные значения</th>
            </tr>
            <tr>
                <th className={classes.odd_item_head}>П1</th>
                <th className={classes.odd_item_head}>Х</th>
                <th className={classes.odd_item_head}>П2</th>
                <th className={classes.prediction_parameter_head}>ИТ1</th>
                <th className={classes.prediction_parameter_head}>ИТ2</th>
                <th className={classes.prediction_parameter_head}>Рез.</th>
                <th className={classes.prediction_parameter_head}>Тотал</th>
                <th className={classes.prediction_parameter_head}>ТБ, %</th>
                <th className={classes.prediction_parameter_head}>ТМ, %</th>
                <th className={classes.prediction_parameter_head}>П1, %</th>
                <th className={classes.prediction_parameter_head}>Х, %</th>
                <th className={classes.prediction_parameter_head}>П2, %</th>
            </tr>
        </thead>
    )
}

export default GamesTableHead