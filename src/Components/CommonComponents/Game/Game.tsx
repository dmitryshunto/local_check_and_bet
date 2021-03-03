import React from 'react';
import { BasicTotalsType, MainPageGameDataType, MainPageOddDataType } from '../../../redux/championshipsReduser';
import { BetType } from '../../../redux/betReducer';
import { filterAddedBetsArray, translate_kind_of_bet_and_home_away } from '../../../CommonFunctions/commonFunctions';
import OddItem from '../../Content/GameStats/ScoreBoardBlock/BetBlock/BetMarkets/OddItem';
import { NavLink } from 'react-router-dom';
import classes from './Game.module.css'
import withAddedBets from '../../../HOC/withSelectionAddedBets';
import cn from 'classnames'

type GamePropsType = {
    basic_totals: BasicTotalsType
    data: MainPageGameDataType
    addedBets: BetType[] | []
    addBet: (bet: BetType) => void
    removeBet: (bet: BetType) => void
    date_of_prediction: string
    name_of_championship: string 
}

const Game: React.FC<GamePropsType> = React.memo((props) => {
    let { basic_totals, data, date_of_prediction } = props;
    let kindsOfBet = Object.keys(basic_totals);
    let predictionitems = kindsOfBet.map((kind_of_bet, index) => {
      const names_of_teams = [data.name_of_team1, data.name_of_team2]
      const numOfKindsOfBet = kindsOfBet.length
      const basic_total = basic_totals[kind_of_bet]
      // @ts-ignore
      const odd_blocks = data[kind_of_bet].odd_blocks
      return withAddedBets({
        date_of_match: date_of_prediction, names_of_teams,
        market: 'Результат', kind_of_bet, classes, odd_className: 'odd_item', odd_blocks,
        filterAddedBetsArray: filterAddedBetsArray, index, basic_total, numOfKindsOfBet, ...props
      })(PredictionItem)
    })
    return (
      <>
        {predictionitems}
        <tr className = {classes.end_of_game_line}>
          <td colSpan = {15}></td>
        </tr>
      </>
    )
  })
  
  type PredictionItem = {
    kind_of_bet: string
    data: MainPageGameDataType
    basic_total: number
    numOfKindsOfBet: number
    name_of_championship: string
    odd_blocks: MainPageOddDataType[]
    selectBet: (bet: MainPageOddDataType) => void
    oddBlocksClasses: string[]
  }
  
  const PredictionItem: React.FC<PredictionItem> = React.memo((props) => {
    let { kind_of_bet, data, basic_total, numOfKindsOfBet, name_of_championship,
      odd_blocks, selectBet, oddBlocksClasses } = props;
    const text_selection_classes: Array<string | null> = [null, null, null];
    const types_of_bets = ['win1', 'x', 'win2'];
    const odd_items = odd_blocks.map((odd_block, index) => {
      if(odd_block.odd) {
        // @ts-ignore
        if(odd_block.odd * data[kind_of_bet]['expected_' + types_of_bets[index]]/100 > 1.6) text_selection_classes[index] = 'green_text_selection'
        // @ts-ignore
        if(odd_block.odd * data[kind_of_bet]['expected_' + types_of_bets[index]]/100 < 0.6) text_selection_classes[index] = 'red_text_selection'
      }
      return (
      <td className={classes.odd_item_container}
        key={index}>
        <OddItem oddClassName={oddBlocksClasses[index]}
          name_of_championship={name_of_championship}
          selectBet={selectBet}
          odd_block={odd_block}
        />
      </td>)
    })
    // @ts-ignore
    const prediction_item_data: MainPageGameKindOfBetDataType = data[kind_of_bet];
    return (
      <>
        <tr className={classes.prediction_odds_block}>
          {kind_of_bet === 'goals' ? <td rowSpan={numOfKindsOfBet} className={classes.teams_block}>
            <NavLink to={`/game_stats/${name_of_championship}/${data.games_id}`}>
              <span>{`${data.name_of_team1}`}</span>
              <span>{`${data.name_of_team2}`}</span>
            </NavLink>
          </td>
            : false}
          <td>{`${translate_kind_of_bet_and_home_away(kind_of_bet)} (${basic_total})`}</td>
          <td>{prediction_item_data.team1_scored !== null ? `${prediction_item_data.team1_scored} : ${prediction_item_data.team2_scored}`
                                                 : '-'}</td>
          {odd_items}
          <td>{prediction_item_data['expected_of_home_team2']}</td>
          <td>{prediction_item_data['expected_of_away_team2']}</td>
          <td className = {cn({[classes.green_text_selection]: Math.abs(prediction_item_data['expected_result2']) > 1.5})}>{prediction_item_data['expected_result2']}</td>
          <td>{prediction_item_data['expected_total2']}</td>
          <td className = {prediction_item_data['selection_over'] ? classes.green_text_selection : ''}>{prediction_item_data['expected_over']}</td>
          <td className = {prediction_item_data['selection_under'] ? classes.green_text_selection : ''}>{prediction_item_data['expected_under']}</td>
          <td className = {classes[text_selection_classes[0]!]}>{prediction_item_data['expected_win1']}</td>
          <td className = {classes[text_selection_classes[1]!]}>{prediction_item_data['expected_x']}</td>
          <td className = {classes[text_selection_classes[2]!]}>{prediction_item_data['expected_win2']}</td>
        </tr>
      </>
    )
  })

export default Game