import React from 'react'
import classes from './WelcomeNUPage.module.css'

const WelcomeNewUserPage = (props) => {
    return (
        <div className = {classes.welcome_new_user_page}>
            <h3>Приветствуем на сайте, {props.login}</h3>
        </div>
        )
}

export default WelcomeNewUserPage;