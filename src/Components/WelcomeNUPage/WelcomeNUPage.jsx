import React from 'react'
import classes from './WelcomeNUPage.module.css'
import { useSelector } from 'react-redux';
import { auth_user_selectors } from '../../Selectors/selectors';
import { Redirect } from 'react-router';

const WelcomeNewUserPage = () => {
    const login = useSelector(auth_user_selectors.get_login)
    if(!login) return <Redirect to = 'profile_page' />
    return (
        <div className = {classes.welcome_new_user_page}>
            <h3>Welcome, {login}</h3>
        </div>
        )
}

export default WelcomeNewUserPage;