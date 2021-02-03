import React from 'react';
import { ChampionshipsPageDataType, setChampionshipsListTC } from '../../../redux/championships_page_reducer'
import { AppStoreType } from '../../../redux/redux'
import { getDataForChampionshipsPage } from '../../../Selectors/selectors';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import classes from './ChampionshipsPage.module.css'
import { filterFunction } from '../../../CommonFunctions/commonFunctions';
import { useSubscribeOnData } from '../../../Hooks/Hooks';

const ChampionshipsPageContainer = (props: any) => {
    useSubscribeOnData(props.setChampionshipsListTC, null, [])
    return <ChampionshipsPage {...props}/>
} 

let ChampionshipsPage = ({data, setChampionshipsListTC}: PropsType) => {
    const championhips = data?.map(name_of_championship => <Championship name_of_championship = {name_of_championship}
                                                                         key = {name_of_championship}/>)
    return (
        <div className = {classes.championship_page}>
            <input type="text" id="myInput" onKeyUp={filterFunction} placeholder="Введите название чемпионата..."></input>
            <ul id = 'championships_list'>
                {championhips}
            </ul>
        </div>
    )
}

type ChampionshipPropsType = {
    name_of_championship: string
}

const Championship = ({name_of_championship}: ChampionshipPropsType) => {
    return (
        <li>
            <div>
                <NavLink to = {`/championships/${name_of_championship}`}>{name_of_championship.toUpperCase()}</NavLink>
            </div>
        </li>
    )
}

type MapStatePropsType = {
    data: ChampionshipsPageDataType
}

type MapDispatchPropsType = {
    setChampionshipsListTC: () => void
}

type OwnPropsType = {
   
}

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType


let mapStateToProps = (state: AppStoreType): MapStatePropsType => {
    return {
       data: getDataForChampionshipsPage(state)
    }
}

let mapDispatchToProps: MapDispatchPropsType = {
    setChampionshipsListTC     
}

export default connect(mapStateToProps, mapDispatchToProps)(ChampionshipsPageContainer)