import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { NavLink, Redirect } from 'react-router-dom';
import { loginUserTC } from '../../redux/authReducer';
import { auth_user_selectors } from '../../Selectors/selectors';
import { connect } from 'react-redux';
import WelcomeNewUserPage from '../WelcomeNUPage/WelcomeNUPage';
import classes from './LoginPage.module.css';
import { AppStoreType } from '../../redux/redux'
import { login_validate as validate } from '../../CommonFunctions/validators';
import RenderField from '../CommonComponents/FormRenderField/FormRenderField';

type LoginPagePropsTypes = MapDispatchToProps & MapStateToPropsType

const LoginPage: React.FC<LoginPagePropsTypes> = (props) => {

    let loginUser = ({ login, password }: LoginUserPropsType) => {
        props.loginUserTC(login, password);
    }
    if (props.isAuthorized) {
        return (
            <Redirect to = {'profile_page'} />
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
    loginUserWarningMessage: string[] | null
}

type LoginUserPropsType = {
    login: string
    password: string
}

let LoginForm: React.FC<InjectedFormProps<LoginUserPropsType, ContactFormOwnPropsType> & ContactFormOwnPropsType> = ({handleSubmit,
    submitting}) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <Field name="login"
                           component={RenderField}
                           type="text"
                           placeholder="Login" />
                </div>
                <div>
                    <Field name="password"
                           component={RenderField}
                           type="password"
                           placeholder="Password" />
                </div>
                <button disabled={submitting} type="submit">Submit</button>
            </form>
            <NavLink to='/createnewuserpage'>Not registered?</NavLink>
        </>
    )
}


const LoginReduxForm = reduxForm<LoginUserPropsType, ContactFormOwnPropsType>({
    form: 'login',
    validate
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
    loginUserWarningMessage: string[] | null
    loginOfLU: string | null
}

let mapStateToProps = (state: AppStoreType): MapStateToPropsType => {
    return {
        isLoggingUser: auth_user_selectors.get_is_logging_user(state),
        isAuthorized: auth_user_selectors.get_is_authorized(state),
        loginUserWarningMessage: auth_user_selectors.get_warning_message(state),
        loginOfLU: auth_user_selectors.get_login(state)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);