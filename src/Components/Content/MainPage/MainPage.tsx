import React from 'react';
import { getIsGettingPrediction, getLoadedPredictions, getDateOfPrediction, getAddedBets, getSelectedDateOfPrediction} from '../../../Selectors/selectors';
import { connect } from 'react-redux';
import Championship from './Championship/Championship';
import DateButton from '../../CommonComponents/DateButton/DateButton';
import { actions as betReducerActions, BetType, addBetActionType, removeBetActionType } from '../../../redux/betReducer';
import BetCoupon from '../../CommonComponents/BetCoupon/BetCoupon';
import classes from './MainPage.module.css'
import { getTodayDate } from '../../../CommonFunctions/commonFunctions';
import { useSubscribeOnData } from '../../../Hooks/Hooks';
import { PreloaderPageWithoutHeader } from '../../CommonComponents/PreloaderPage/PreloaderPage';
import {AppStoreType} from '../../../redux/redux'
import { RouteComponentProps } from 'react-router-dom';
import { actions as championshipsReducerActions, setAllPredictionsTC, MainPageChampionshipDataType} from './../../../redux/championshipsReduser';

const MainPageContainer: React.FC<PropsType> = (props) => {
  const date_of_prediction = props.match.params.date_of_prediction ? props.match.params.date_of_prediction
                                                                   : getTodayDate()
                                                                   
  useSubscribeOnData(props.setAllPredictionsTC, props.set_main_page_initial_state, [date_of_prediction])
  if(props.isGettingPrediction) return <PreloaderPageWithoutHeader />
  return <MainPage {...props}/>
} 

const MainPage: React.FC<PropsType> = React.memo(({ predictions, bets, addBet, 
  removeBet, selected_date_of_prediction, date_of_prediction, selectDateOfPrediction, changeChampionshipCheckedStatus }) => {
  
  let championships = predictions ? predictions.map((championship, index) => <Championship bets = {bets}
                                                                                  championship = {championship}
                                                                                  changeChampionshipCheckedStatus = {changeChampionshipCheckedStatus}
                                                                                  key = {index}
                                                                                  addBet = {addBet}
                                                                                  removeBet = {removeBet}
                                                                                  date_of_prediction = {date_of_prediction}/>) 
                                  : <EmptyPage />
  
  return (
    <div className = {classes.championships_container}>
      <DateButton selectDateOfPrediction = {selectDateOfPrediction}
                  selected_date_of_prediction = {selected_date_of_prediction}
                  additional_url = {''}
                  />
      {championships}
      <BetCoupon />
    </div>
  );
})

const EmptyPage = () => {
  return (
    <div className = {classes.empty_page}>
      <h3>На этот день прогнозов нет</h3>
    </div>
  )
}

type MapDispatchToPropsType = {
  setAllPredictionsTC: (date_of_prediction: string) => void
  addBet: (bet: BetType) => addBetActionType
  removeBet: (bet: BetType) => removeBetActionType
  selectDateOfPrediction: (date_of_prediction: string) => void
  set_main_page_initial_state: () => void
  changeChampionshipCheckedStatus: (name_of_championship: string, date_of_prediction: string) => void
}

let mapDispatchToProps: MapDispatchToPropsType = {
  setAllPredictionsTC, 
  addBet: betReducerActions.addBet,
  removeBet: betReducerActions.removeBet,
  selectDateOfPrediction: championshipsReducerActions.selectDateOfPrediction ,
  set_main_page_initial_state: championshipsReducerActions.set_main_page_initial_state,
  changeChampionshipCheckedStatus: championshipsReducerActions.changeChampionshipCheckedStatus
}

type MapStateToPropsType = {
  bets: BetType[] | []
  date_of_prediction: string
  selected_date_of_prediction: string
  predictions: MainPageChampionshipDataType[] | null
  isGettingPrediction: boolean
}

let mapStateToProps = (state: AppStoreType): MapStateToPropsType => {
  return {
    bets: getAddedBets(state),
    date_of_prediction: getDateOfPrediction(state),
    selected_date_of_prediction: getSelectedDateOfPrediction(state),
    predictions: getLoadedPredictions(state),
    isGettingPrediction: getIsGettingPrediction(state)
  }
}

type RoutePropsType = RouteComponentProps<{date_of_prediction: string}>

type PropsType = MapStateToPropsType & MapDispatchToPropsType & RoutePropsType

export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppStoreType>(mapStateToProps, mapDispatchToProps)(MainPageContainer);