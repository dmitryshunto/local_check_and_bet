import React, { useEffect } from 'react'
import { Field, reduxForm, InjectedFormProps, Form } from 'redux-form'
import { Link, Redirect } from 'react-router-dom';
import { loginUserTC } from '../../redux/authReducer';
import { auth_user_selectors } from '../../Selectors/selectors';
import { connect } from 'react-redux';
import classes from './LoginPage.module.css';
import { AppStoreType } from '../../redux/redux'
import { login_validate as validate } from '../../CommonFunctions/validators';
import { AntInput } from '../CommonComponents/FormRenderField/FormRenderField';
import { Button, Col, Row } from 'antd';

type LoginPagePropsTypes = MapDispatchToProps & MapStateToPropsType

const LoginPage: React.FC<LoginPagePropsTypes> = (props) => {

    useEffect(()=> {
        document.title = 'Login Page'
    }, [])

    let loginUser = ({ login, password }: LoginUserPropsType) => {
        props.loginUserTC(login, password);
    }
    if (props.isAuthorized) {
        return (
            <Redirect to={'profile_page'} />
        )
    } else {
        return (
            <div>
                <LoginReduxForm onSubmit={loginUser}
                    isLoggingUser={props.isLoggingUser}
                    loginUserWarningMessage={props.loginUserWarningMessage} />
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

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
}

let LoginForm: React.FC<InjectedFormProps<LoginUserPropsType, ContactFormOwnPropsType> & ContactFormOwnPropsType> = ({ handleSubmit,
    submitting }) => {
    return (
        <Row>
            <Col span={6} offset={9}>
                <Form {...layout} onSubmit={handleSubmit}>
                    <div>
                        <Field name="login"
                            component={AntInput}
                            type="text"
                            placeholder="Login" />
                    </div>
                    <div>
                        <Field name="password"
                            component={AntInput}
                            type="password"
                            placeholder="Password" />
                    </div>
                    <Button disabled={submitting} type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Link className={classes.link} to='/createnewuserpage'>Not registered?</Link>
                </Form>
            </Col>
        </Row>
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