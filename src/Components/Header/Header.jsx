import React from 'react';
import classes from './Header.module.css';
import { NavLink } from 'react-router-dom';
import { getLoginOfLU } from '../../Selectors/selectors';
import { connect } from 'react-redux';
import { logoutUserTC } from '../../redux/authReducer';

const Header = (props) => {
    return (
        <div className = {classes.header}>
            <div><NavLink to = '/'>Главная страница</NavLink></div>
            <div><NavLink to = '/championships'>Лиги</NavLink></div>
            <div><NavLink to = '/my_net_main_page'>My Net</NavLink></div>
            {props.login ? <MyProfileLink   logoutUserTC = {props.logoutUserTC}
                                            login = {props.login}/> : <div><NavLink to = '/loginpage'>Логин</NavLink></div>}
        </div>
    )
}

const MyProfileLink = ({logoutUserTC, login}) => {
    return (
        <>
            <div><NavLink to = '/profile_page'>{login}</NavLink></div>
            <div className = {classes.logout_button}><button onClick = {logoutUserTC}>Выход</button></div>
        </>
    )
}

let mapStateToProps = (state) => {
    return {
        login: getLoginOfLU(state)
    }
}
 
let mapDispatchToProps = {
    logoutUserTC
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);