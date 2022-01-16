import React, { memo, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useSubscribeOnData } from '../../../Hooks/Hooks';
import { AppStoreType } from '../../../redux/redux';
import { actions, Championship, set_my_net_predictionsTC } from './../../../redux/mainPageReducer';
import {added_bets_selectors, mainPage_selectors} from '../../../Selectors/selectors'
import { connect } from 'react-redux';
import DateButton from '../../CommonComponents/DateButton/DateButton';
import { PreloaderPageWithoutHeader } from '../../CommonComponents/PreloaderPage/PreloaderPage';
import ChampionshipTable from '../../CommonComponents/Championship/Championship';
import { BetType, addBetActionType, removeBetActionType, selectBetTC, actions as betReducerActions} from '../../../redux/betReducer';
import BetCoupon from '../../CommonComponents/BetCoupon/BetCoupon';
import { getTodayDate } from '../../../CommonFunctions/commonFunctions';

type PropsTypes = MapStateToPropsType & MapDispatchToPropsType & OwnPropsType &  RouteComponentProps<RoutePropsType>

const MainPageContainer: React.FC<PropsTypes> = (props) => {
    const date_of_prediction = props.match.params.date_of_prediction ? props.match.params.date_of_prediction
                                                                     : getTodayDate()
                                                                     
    useSubscribeOnData(props.set_my_net_predictionsTC, props.set_mainPage_initial_state, [date_of_prediction])
    useEffect(() => {
        document.title = 'Main Page'
    }, [])
    if(props.isGettingData) return <PreloaderPageWithoutHeader />
    return <MainPage {...props}/>
  } 
  

let MainPage: React.FC<PropsTypes> = memo(({...props}) => {
    const championships = props.data?.map(item => {
        return <ChampionshipTable  key = {item.country_name + item.name_of_championship} 
                                        changeChampionshipCheckedStatus = {props.changeChampionshipCheckedStatus}                                              
                                        data = {item}
                                        bets = {props.bets}
                                        selectBetTC = {props.selectBetTC}
                                        date_of_match = {props.date_of_prediction}/>
    })
    
    return (
        <div>
            <DateButton selected_date_of_prediction = {props.selected_date_of_prediction}
                        selectDateOfPrediction = {props.selectDateOfPrediction}
                        additional_url = {'mainPage'}/>
            <div>
                {championships}
            </div>
            <BetCoupon />
        </div>
    )
})




type OwnPropsType = {
 
}

type RoutePropsType = {
    date_of_prediction: string  
}

type MapDispatchToPropsType = {
    set_my_net_predictionsTC: (date_of_prediction: string) => void
    selectBetTC: (bet: BetType) => void
    set_mainPage_initial_state: () => void
    selectDateOfPrediction: (selected_date_of_prediction: string) => void
    addBet: (bet: BetType) => addBetActionType
    removeBet: (bet: BetType) => removeBetActionType
    changeChampionshipCheckedStatus: typeof actions.changeChampionshipCheckedStatus
}

const mapDispatchToProps: MapDispatchToPropsType = {
    set_my_net_predictionsTC,
    selectBetTC,
    set_mainPage_initial_state: actions.set_mainPage_initial_state,
    selectDateOfPrediction: actions.selectDateOfPrediction,
    addBet: betReducerActions.addBet,
    removeBet: betReducerActions.removeBet,
    changeChampionshipCheckedStatus: actions.changeChampionshipCheckedStatus
}

type MapStateToPropsType = {
    data: Championship[] | null
    isGettingData: boolean
    selected_date_of_prediction: string
    date_of_prediction: string
    bets: BetType[] | []
}

const mapStateToProps = (state: AppStoreType): MapStateToPropsType => {
    return {
      data: mainPage_selectors.get_data(state),
      isGettingData: mainPage_selectors.get_is_getting_data(state),
      selected_date_of_prediction: mainPage_selectors.selected_date_of_prediction(state),
      date_of_prediction: mainPage_selectors.get_date_of_prediction(state),
      bets: added_bets_selectors.get_data(state)
    }
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(MainPageContainer)