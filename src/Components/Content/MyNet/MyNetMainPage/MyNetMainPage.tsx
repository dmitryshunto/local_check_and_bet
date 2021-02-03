import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useSubscribeOnData } from '../../../../Hooks/Hooks';
import { AppStoreType } from '../../../../redux/redux';
import { actions, MyNetChampionship, set_my_net_predictionsTC } from './../../../../redux/my_net_main_page_reducer';
import {my_net_main_page_selectors} from '../../../../Selectors/selectors'
import { connect } from 'react-redux';
import DateButton from '../../../CommonComponents/DateButton/DateButton';
import classes from './MyNetMainPage.module.css'
import { PreloaderPageWithoutHeader } from '../../../CommonComponents/PreloaderPage/PreloaderPage';
import MyNetChampionshipTable from './MyNetChampionship/MyNetChampionship';

type PropsTypes = MapStateToPropsType & MapDispatchToPropsType & OwnPropsType &  RouteComponentProps<RoutePropsType>

const MyNetMainPageContainer: React.FC<PropsTypes> = (props) => {
    useSubscribeOnData(props.set_my_net_predictionsTC, props.set_my_net_main_page_initial_state, [props.match.params.date_of_prediction])
    if(props.isGettingData) return <PreloaderPageWithoutHeader />
    const championships = props.data?.map(item => {
        return <MyNetChampionshipTable key = {item.country_name + item.name_of_championship} {...item}/>
    })
    if(!props.data) {
        return (
            <div>На этот день прогнозов нет</div>
        )
    }
    return (
        <div className = {classes.my_net_main_page_container}>
            <DateButton selected_date_of_prediction = {props.selected_date_of_prediction}
                        selectDateOfPrediction = {props.selectDateOfPrediction}
                        additional_url = {'my_net_main_page'}/>
            <div>
                {championships}
            </div>
        </div>
    )
}

type OwnPropsType = {
 
}

type RoutePropsType = {
    date_of_prediction: string  
}

type MapDispatchToPropsType = {
    set_my_net_predictionsTC: (date_of_prediction: string) => void
    set_my_net_main_page_initial_state: () => any
    selectDateOfPrediction: (selected_date_of_prediction: string) => any
}

const mapDispatchToProps: MapDispatchToPropsType = {
    set_my_net_predictionsTC,
    set_my_net_main_page_initial_state: actions.set_my_net_main_page_initial_state,
    selectDateOfPrediction: actions.selectDateOfPrediction
}

type MapStateToPropsType = {
    data: MyNetChampionship[] | null
    isGettingData: boolean
    selected_date_of_prediction: string
}

const mapStateToProps = (state: AppStoreType): MapStateToPropsType => {
    return {
      data: my_net_main_page_selectors.get_data(state),
      isGettingData: my_net_main_page_selectors.get_is_getting_data(state),
      selected_date_of_prediction: my_net_main_page_selectors.selected_date_of_prediction(state)
    }
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(MyNetMainPageContainer)