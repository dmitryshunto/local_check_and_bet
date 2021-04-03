import React from 'react';
import { ChampionshipListItem, ChampionshipsPageDataType, setChampionshipsListTC } from '../../../redux/championships_page_reducer'
import { AppStoreType } from '../../../redux/redux'
import { championships_page_selectors } from '../../../Selectors/selectors';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import classes from './ChampionshipsPage.module.css'
import { filterFunction } from '../../../CommonFunctions/commonFunctions';
import { useSubscribeOnData } from '../../../Hooks/Hooks';
import { PreloaderPageWithoutHeader } from '../../CommonComponents/PreloaderPage/PreloaderPage';
import { actions } from './../../../redux/championships_page_reducer';

const ChampionshipsPageContainer = (props: PropsType) => {
    useSubscribeOnData(props.setChampionshipsListTC, props.set_initial_state, [])
    if(props.isGettingData) return <PreloaderPageWithoutHeader />
    return <ChampionshipsPage {...props}/>
} 

let ChampionshipsPage = ({data}: PropsType) => {
    const championhips = data?.map(item => <Championship {...item}
                                                         key = {item.db_name}/>)
    return (
        <div className = {classes.championship_page}>
            <input type="text" id="myInput" onKeyUp={filterFunction} placeholder="Insert league name..."></input>
            <ul id = 'championships_list'>
                {championhips}
            </ul>
        </div>
    )
}


const Championship = (props: ChampionshipListItem) => {
    return (
        <li>
            <div>
                <NavLink to = {`/championships/${props.db_name}`}>{`${props.country_name} ${props.name_of_championship}`.toUpperCase()}</NavLink>
            </div>
        </li>
    )
}

type MapStatePropsType = ReturnType<typeof mapStateToProps>

type MapDispatchPropsType = {
    setChampionshipsListTC: () => void
    set_initial_state: typeof actions.set_initial_state 
}

type OwnPropsType = {
   
}

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType


let mapStateToProps = (state: AppStoreType) => {
    return {
       data: championships_page_selectors.get_data(state),
       isGettingData: championships_page_selectors.get_is_getting_data(state)
    }
}

let mapDispatchToProps: MapDispatchPropsType = {
    setChampionshipsListTC,
    set_initial_state: actions.set_initial_state    
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(ChampionshipsPageContainer)