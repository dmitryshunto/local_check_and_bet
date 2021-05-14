import React, { useEffect } from 'react';
import { Field, reduxForm, InjectedFormProps, Form } from 'redux-form'
import { connect, useSelector } from 'react-redux';
import { createNewUserTC, set_info_for_creating_userTC, add_user_photo_to_stateTC, actions } from '../../redux/createNUReducer';
import { auth_user_selectors, create_new_user_page_selectors } from '../../Selectors/selectors';
import classes from './CreateNewUserPage.module.css'
import { validate } from '../../CommonFunctions/validators';
import { AppStoreType } from '../../redux/redux';
import { AntInput } from '../CommonComponents/FormRenderField/FormRenderField';
import { useSubscribeOnData } from '../../Hooks/Hooks';
import { withPreloader } from '../../HOC/withPreloader';
import { PreloaderPageWithoutHeader } from '../CommonComponents/PreloaderPage/PreloaderPage';
import AvatarComonent from '../CommonComponents/PhotoEditor/PhotoEditor';
import { Redirect } from 'react-router';
import { Button, Col, Row } from 'antd';


type CreateNewUserPropsType = {
    login: string
    password: string
}

type PropType = MapStateToPropsType & MapDispatchToPropsType

const CreateNewUserPageContainer: React.FC<PropType> = (props) => {
    useSubscribeOnData(props.set_info_for_creating_userTC, null, [])
    useEffect(() => {
        document.title = 'Open Account'
    }, [])
    return <CreateNewUserPage {...props} />
}


let CreateNewUserPage: React.FC<PropType> = (props) => {

    let createNewUser = ({ login, password }: CreateNewUserPropsType) => {
        props.createNewUserTC(login, password);
    }

    const user_login = useSelector(auth_user_selectors.get_login)

    if (props.createNUsuccess === null || props.warning_messages) {
        const warning_messages_elems = props.warning_messages?.map((msg, i) => <div key={i}>{msg}</div>)
        if (user_login) return <Redirect to='profile_page' />
        return (
            <div>
                <Row style = {{marginBottom: '0.5%'}}>
                    <Col span={4} offset={10}>
                        <AvatarComonent updatePhotoTC={props.add_user_photo_to_stateTC}
                            photo_url={props.avatar_photo_url}
                            default_photo_url={props.default_photo_url}
                            isLoadingPhoto={props.isLoadingPhoto}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={9}>
                        <CreateNewUserReduxForm onSubmit={createNewUser} {...props} />
                    </Col>
                </Row>
                {warning_messages_elems &&
                    <div className={classes.warning_message}>
                        {warning_messages_elems}
                    </div>}
            </div>
        )
    } else if (props.createNUsuccess) {
        return <Redirect to='welcome_new_user' />
    }
    return null
}

CreateNewUserPage = withPreloader<PropType>(PreloaderPageWithoutHeader, 'isGettingData')(CreateNewUserPage)

type FormDataType = {
    login: string
    password: string
    confirm_password: string
}

const CreateNewUserForm: React.FC<InjectedFormProps<FormDataType>> = (props) => {
    const { handleSubmit, submitting } = props
    return (
        <Form onSubmit={handleSubmit}>

            <Field name="login"
                placeholder="login"
                component={AntInput}
                type="text"
            />

            <Field name="password"
                placeholder="password"
                component={AntInput}
                type="password"
            />

            <Field name="confirm_password"
                placeholder="confirm password"
                component={AntInput}
                type="password"
            />
            <Button disabled={submitting} htmlType="submit" type={'primary'}>Create account</Button>
        </Form>
    )
}

const CreateNewUserReduxForm = reduxForm<FormDataType>({
    form: 'createNewUser',
    validate
})(CreateNewUserForm)

type MapDispatchToPropsType = {
    createNewUserTC: (login: string, password: string) => void
    set_info_for_creating_userTC: () => void
    set_initial_state: typeof actions.set_initial_state
    add_user_photo_to_stateTC: (photo_file: File) => void
}

let mapDispatchToProps: MapDispatchToPropsType = {
    createNewUserTC,
    set_info_for_creating_userTC,
    set_initial_state: actions.set_initial_state,
    add_user_photo_to_stateTC
}

let mapStateToProps = (state: AppStoreType) => {
    return {
        isGettingData: create_new_user_page_selectors.get_is_getting_data(state),
        warning_messages: create_new_user_page_selectors.get_warning_message(state),
        createNUsuccess: create_new_user_page_selectors.get_operation_success(state),
        default_photo_url: create_new_user_page_selectors.get_default_photo_url(state),
        avatar_photo_url: create_new_user_page_selectors.get_avatar_photo_url(state),
        isLoadingPhoto: create_new_user_page_selectors.get_is_loading_photo(state)
    }
}

type MapStateToPropsType = ReturnType<typeof mapStateToProps>

export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppStoreType>(mapStateToProps, mapDispatchToProps)(CreateNewUserPageContainer);