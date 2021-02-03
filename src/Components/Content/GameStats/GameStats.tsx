import React from 'react';
import { setGameStatsTC, actions, GameStatsDataType } from '../../../redux/game_stats_reducer';
import { connect } from 'react-redux';
import { getGameStatsData, getIsGettingGameStatsData, getAddedBets } from '../../../Selectors/selectors';
import MatchStatistics from './MatchStatistics/MatchStatistics';
import classes from './GameStats.module.css';
import MatchAnalysis from './MatchAnalysis/MatchAnalysis';
import ScoreBoardBlock from './ScoreBoardBlock/ScoreBoardBlock';
import { useState } from 'react';
import BetCoupon from '../../CommonComponents/BetCoupon/BetCoupon';
import ToggleButtons from '../../CommonComponents/ToggleButton/ToggleButton'
import { PreloaderPageWithoutHeader } from '../../CommonComponents/PreloaderPage/PreloaderPage';
import { useSubscribeOnData } from '../../../Hooks/Hooks';
import { isEmpty } from '../../../CommonFunctions/commonFunctions';
import {BetType} from '../../../redux/betReducer'
import {AppStoreType, KindOfBetType} from '../../../redux/redux'

import { RouteComponentProps } from 'react-router-dom';

type PropsTypes = MapStateToPropsType & MapDispatchToPropsType & OwnPropsType &  RouteComponentProps<RoutePropsType>

const GameStatsPageContainer: React.FC<PropsTypes> = (props) => {
  useSubscribeOnData(props.setGameStatsTC, props.set_game_stats_initial_state, [props.match.params.name_of_championship, props.match.params.games_id])
  if (!isEmpty(props.data)) {
    return <GameStatsPage {...props} />
  } else return <PreloaderPageWithoutHeader />

}

const GameStatsPage: React.FC<PropsTypes> = (props) => {
  const { data } = props;
  const [kind_of_bet, set_kind_of_bet] = useState<KindOfBetType>('goals');
  return (
    <div className={classes.game_stats_page_container}>
      <div className={classes.game_stats_page_row}>
        <ToggleButtons kinds_of_bet={props.data!.kinds_of_bet}
          selected_kind_of_bet={kind_of_bet}
          set_selected_kind_of_bet={set_kind_of_bet} />
      </div>
      <div className={classes.game_stats_page_row}>
        <ScoreBoardBlock name_of_championship={props.match.params.name_of_championship}
          names_of_teams={data!.names_of_teams}
          score_board_block={data!.score_board_block[kind_of_bet]!}
          date_of_match={data!.date_of_match}
          addedBets={props.addedBets}
          kind_of_bet={kind_of_bet}
          basic_total={data!.basic_totals[kind_of_bet]!}
        />
      </div>
      <div className={classes.game_stats_page_row}>
        <MatchStatistics data={data!.game[kind_of_bet]!} />
        <MatchAnalysis analysis_block={data!.analysis_block[kind_of_bet]!}
          last_games_info={data!.info_about_last_matches[kind_of_bet]!}
          names_of_teams={data!.names_of_teams}
        />
      </div>
      <BetCoupon />
    </div>
  )
}


type OwnPropsType = {
   
}

type RoutePropsType = {
  name_of_championship: string  
  games_id: string
}

type MapDispatchToPropsType = {
  setGameStatsTC: (name_of_championship: string, games_id: number) => void
  set_game_stats_initial_state: () => any
}

let mapDispatchToProps: MapDispatchToPropsType = {
  setGameStatsTC, 
  set_game_stats_initial_state: actions.set_game_stats_initial_state
}

type MapStateToPropsType = {
  addedBets: BetType[] | []
  data: GameStatsDataType | null
  isGettingData: boolean
}

let mapStateToProps = (state: AppStoreType): MapStateToPropsType => {
  return {
    addedBets: getAddedBets(state),
    data: getGameStatsData(state),
    isGettingData: getIsGettingGameStatsData(state)
  }
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(GameStatsPageContainer);