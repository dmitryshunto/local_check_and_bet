import React, { useEffect } from 'react';
import { Field, reduxForm, WrappedFieldProps, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux';
import { createNewUserTC, SetInitialStateCNUreducer, actions } from '../../redux/createNUReducer';
import { create_new_user_page_selectors } from '../../Selectors/selectors';
import WelcomeNewUserPage from '../WelcomeNUPage/WelcomeNUPage';
import classes from './CreateNewUserPage.module.css'
import { validate } from '../../CommonFunctions/validators';
import { AppStoreType } from '../../redux/redux';
import { useLocation } from 'react-router-dom';

type CreateNewUserPropsType = {
    login: string
    password: string
}

const CreateNewUserPage: React.FC<MapStateToPropsType & MapDispatchToPropsType> = (props) => {

    const { pathname } = useLocation();
    useEffect(() => {
        if(!props.createNUsuccess) props.set_initial_state()
    }, [pathname]);
    
    let createNewUser = ({ login, password }: CreateNewUserPropsType) => {
        props.createNewUserTC(login, password);
    }

    if (props.createNUsuccess === null || props.warning_messages) {
        const warning_messages_elems = props.warning_messages?.map((msg, i) => <div key={i}>{msg}</div>)
        return (
            <div className={classes.create_new_user_page}>
                <div className={classes.create_new_user_form}>
                    <CreateNewUserReduxForm onSubmit={createNewUser} {...props} />
                </div>
                {warning_messages_elems &&
                    <div className={classes.warning_message}>
                        {warning_messages_elems}
                    </div>}
            </div>
        )
    } else if (props.createNUsuccess) {
        return (
            <WelcomeNewUserPage login={props.loginOfNU} />
        )
    } else return null
}

type InputType = 'text' | 'password'

type RenderFieldOwnParamsType = {
    label: string
    type: InputType
}

type RenderField = RenderFieldOwnParamsType & WrappedFieldProps

const renderField = ({
    input,
    label,
    type,
    meta: { touched, error, warning }
}: RenderField): React.ReactNode => (
    <div className={classes.input_block}>
        <div className={classes.label_class}>
            {label}
        </div>
        <div className={classes.input_class}>
            <input {...input} type={type} />
            {touched &&
                ((error && <span>{error}</span>) ||
                    (warning && <span>{warning}</span>))}
        </div>
    </div>
)

type FormDataType = {
    login: string
    password: string
    confirm_password: string
}

const CreateNewUserForm: React.FC<InjectedFormProps<FormDataType>> = (props) => {
    const { handleSubmit, submitting } = props
    return (
        <form onSubmit={handleSubmit}>

            <Field name="login"
                label="Логин"
                component={renderField}
                type="text"
            />

            <Field name="password"
                label="Пароль"
                component={renderField}
                type="password"
            />

            <Field name="confirm_password"
                label="Подтвердите пароль"
                component={renderField}
                type="password"
            />
            <button disabled={submitting} type="submit">Создать аккаунт</button>
        </form>
    )
}

const CreateNewUserReduxForm = reduxForm<FormDataType>({
    form: 'createNewUser',
    validate
})(CreateNewUserForm)

type MapDispatchToPropsType = {
    createNewUserTC: (login: string, password: string) => void
    set_initial_state: typeof actions.set_initial_state
}

let mapDispatchToProps: MapDispatchToPropsType = {
    createNewUserTC,
    set_initial_state: actions.set_initial_state
}

type MapStateToPropsType = {
    isCreatingUser: boolean
    loginOfNU: string | null
    warning_messages: string[] | null
    createNUsuccess: boolean | null
}

let mapStateToProps = (state: AppStoreType): MapStateToPropsType => {
    return {
        isCreatingUser: create_new_user_page_selectors.get_is_creating_user(state),
        loginOfNU: create_new_user_page_selectors.get_new_user_login(state),
        warning_messages: create_new_user_page_selectors.get_warning_message(state),
        createNUsuccess: create_new_user_page_selectors.get_operation_success(state)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewUserPage);