import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { NavLink } from 'react-router-dom';
import { loginUserTC } from '../../redux/authReducer';
import { getIsLoggingUser, getIsAuthorizedLU, getLUwarningMessage, getLoginOfLU } from '../../Selectors/selectors';
import { connect } from 'react-redux';
import WelcomeNewUserPage from '../WelcomeNUPage/WelcomeNUPage';
import classes from './LoginPage.module.css';
import { AppStoreType } from '../../redux/redux'

type LoginPagePropsTypes = MapDispatchToProps & MapStateToPropsType

const LoginPage: React.FC<LoginPagePropsTypes> = (props) => {

    let loginUser = ({ login, password }: LoginUserPropsType) => {
        props.loginUserTC(login, password);
    }
    if (props.isAuthorized) {
        return (
            <WelcomeNewUserPage login={props.loginOfLU} />
        )
    } else {
        return (
            <div className={classes.login_page}>
                <div className={classes.login_form}>
                    <LoginReduxForm onSubmit={loginUser}
                                    isLoggingUser = {props.isLoggingUser}
                                    loginUserWarningMessage = {props.loginUserWarningMessage}/>
                </div>
            </div>
        )
    }
}

type ContactFormOwnPropsType = {
    isLoggingUser: boolean
    loginUserWarningMessage: string | null
}

type LoginUserPropsType = {
    login: string
    password: string
}

let LoginForm: React.FC<InjectedFormProps<LoginUserPropsType, ContactFormOwnPropsType> & ContactFormOwnPropsType> = ({handleSubmit, isLoggingUser, loginUserWarningMessage}) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <Field name="login" component="input" type="text" placeholder="Логин" />
                </div>
                <div>
                    <Field name="password" component="input" type="password" placeholder="Пароль" />
                </div>
                <button disabled={isLoggingUser ? true : false} type="submit">Отправить</button>
                {loginUserWarningMessage && <div>Не правильные логин или пароль</div>}
            </form>
            <NavLink to='/createnewuserpage'>Не зарегистрированы?</NavLink>
        </>
    )
}


const LoginReduxForm = reduxForm<LoginUserPropsType, ContactFormOwnPropsType>({
    form: 'login'
})(LoginForm)

type MapDispatchToProps = {
    loginUserTC: (login: string, password: string) => void
}

let mapDispatchToProps: MapDispatchToProps = {
    loginUserTC
}

type MapStateToPropsType = {
    isLoggingUser: boolean
    isAuthorized: boolean
    loginUserWarningMessage: string | null
    loginOfLU: string | null
}

let mapStateToProps = (state: AppStoreType): MapStateToPropsType => {
    return {
        isLoggingUser: getIsLoggingUser(state),
        isAuthorized: getIsAuthorizedLU(state),
        loginUserWarningMessage: getLUwarningMessage(state),
        loginOfLU: getLoginOfLU(state)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);