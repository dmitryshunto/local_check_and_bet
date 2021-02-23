import React from 'react';
import { Field, reduxForm, WrappedFieldProps, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux';
import { createNewUserTC } from '../../redux/createNUReducer';
import { create_new_user_page_selectors } from '../../Selectors/selectors';
import WelcomeNewUserPage from '../WelcomeNUPage/WelcomeNUPage';
import classes from './CreateNewUserPage.module.css'
import { validate } from '../../CommonFunctions/validators';
import { AppStoreType } from '../../redux/redux';

type CreateNewUserPropsType = {
    login: string
    password: string
}

const CreateNewUserPage: React.FC<MapStateToPropsType & MapDispatchToPropsType> = (props) => {

    let createNewUser = ({ login, password }: CreateNewUserPropsType) => {
        props.createNewUserTC(login, password);
    }

    if (props.createNUsuccess === null || props.createNUWarningMessage) {
        return (
            <div className={classes.create_new_user_page}>
                <div className={classes.create_new_user_form}>
                    <CreateNewUserReduxForm onSubmit={createNewUser} {...props} />
                </div>
                {props.createNUWarningMessage &&
                    <div className={classes.warning_message}>
                        {props.createNUWarningMessage}
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
}

let mapDispatchToProps: MapDispatchToPropsType = {
    createNewUserTC
}

type MapStateToPropsType = {
    isCreatingUser: boolean
    loginOfNU: string | null
    createNUWarningMessage: string | null
    createNUsuccess: boolean | null
}

let mapStateToProps = (state: AppStoreType): MapStateToPropsType => {
    return {
        isCreatingUser: create_new_user_page_selectors.get_is_creating_user(state),
        loginOfNU: create_new_user_page_selectors.get_new_user_login(state),
        createNUWarningMessage: create_new_user_page_selectors.get_warning_message(state),
        createNUsuccess: create_new_user_page_selectors.get_operation_success(state)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewUserPage);