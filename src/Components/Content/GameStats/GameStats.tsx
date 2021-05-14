import React, { useEffect } from 'react';
import { setGameStatsTC, actions, GameStatsDataType } from '../../../redux/game_stats_reducer';
import { connect } from 'react-redux';
import { game_stats_selectors, added_bets_selectors } from '../../../Selectors/selectors';
import MatchStatistics from './MatchStatistics/MatchStatistics';
import classes from './GameStats.module.css';
import { useState } from 'react';
import BetCoupon from '../../CommonComponents/BetCoupon/BetCoupon';
import ToggleButtons from '../../CommonComponents/ToggleButton/ToggleButton'
import { PreloaderPageWithoutHeader } from '../../CommonComponents/PreloaderPage/PreloaderPage';
import { useSubscribeOnData } from '../../../Hooks/Hooks';
import { BetType, selectBetTC } from '../../../redux/betReducer'
import { AppStoreType, NewKindOfBet } from '../../../redux/redux'
import { RouteComponentProps } from 'react-router-dom';
import GameStatsHeader from './GameStatsHeader/GameStatsHeader';
import BetBlock from './BetBlock/BetBlock';
import LastMatchesBlock from './LastMatchesBlock/LastMatchesBlock';

type PropsTypes = MapStateToPropsType & MapDispatchToPropsType & OwnPropsType & RouteComponentProps<RoutePropsType>

const GameStatsPageContainer: React.FC<PropsTypes> = React.memo((props) => {
  useSubscribeOnData(props.setGameStatsTC, props.set_game_stats_initial_state, [props.match.params.db_name, props.match.params.game_id])
  useEffect(() => {
    if (props.data) {
      document.title = `${props.data.names_of_teams[0]} - ${props.data.names_of_teams[1]}`
    }
  }, [props.data])
  if (props.isGettingData) return <PreloaderPageWithoutHeader />
  return <GameStatsPage {...props} />
})

const GameStatsPage: React.FC<PropsTypes> = React.memo((props) => {
  const { data } = props;
  const [kind_of_bet, set_kind_of_bet] = useState<NewKindOfBet>('goals');
  return (
    <div>
      <div className={classes.game_stats_page_row}>
        <GameStatsHeader date_of_match={data!.date_of_match}
          names_of_teams={data!.names_of_teams}
          home_team_scored={data!.score_board_block[kind_of_bet]!.home}
          away_team_scored={data!.score_board_block[kind_of_bet]!.away} />
      </div>
      <div className={classes.game_stats_page_row}>
        <ToggleButtons kinds_of_bet={props.data!.kinds_of_bet}
          selected_kind_of_bet={kind_of_bet}
          set_selected_kind_of_bet={set_kind_of_bet} />
      </div>
      <div className={classes.game_stats_page_row}>
        <BetBlock db_name={props.match.params.db_name}
          game_id={Number(props.match.params.game_id)}
          home_team={props.data!.names_of_teams[0]}
          away_team={props.data!.names_of_teams[1]}
          bet_block={props.data!.score_board_block![kind_of_bet]!.bet_block}
          selectBetTC={props.selectBetTC}
          date_of_match={data!.date_of_match}
          addedBets={props.addedBets}
          kind_of_bet={kind_of_bet} />
      </div>
      <div className={classes.game_stats_page_row}>
        <MatchStatistics data={data!.game[kind_of_bet]!} />
        <LastMatchesBlock last_games_info={data!.info_about_last_matches[kind_of_bet]!}
          names_of_teams={data!.names_of_teams} />
      </div>
      <BetCoupon />
    </div>
  )
})


type OwnPropsType = {

}

type RoutePropsType = {
  db_name: string
  game_id: string
}

type MapDispatchToPropsType = {
  setGameStatsTC: (name_of_championship: string, games_id: number) => void
  selectBetTC: (bet: BetType) => void
  set_game_stats_initial_state: () => void
}

let mapDispatchToProps: MapDispatchToPropsType = {
  setGameStatsTC,
  selectBetTC,
  set_game_stats_initial_state: actions.set_game_stats_initial_state
}

type MapStateToPropsType = {
  addedBets: BetType[] | []
  data: GameStatsDataType | null
  isGettingData: boolean
}

let mapStateToProps = (state: AppStoreType): MapStateToPropsType => {
  return {
    addedBets: added_bets_selectors.get_data(state),
    data: game_stats_selectors.get_data(state),
    isGettingData: game_stats_selectors.get_is_getting_data(state)
  }
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(GameStatsPageContainer);