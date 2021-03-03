import React from 'react';
import Modal, { ModalPropsType } from '../Modal/Modal';
import classes from './ErrorPage.module.css'

const ErrorPage: React.FC<OwnPropsType> = (props) => {
    return (
        <div className={classes.empty_page}>
            <h3>{props.message}</h3>    
        </div>
    )
}

type OwnPropsType = {
    message: string | null | boolean
}

export const ModalErrorPage: React.FC<OwnPropsType & ModalPropsType> = (props) => {
    return (
        <Modal active = {props.active} close_modal = {props.close_modal}>
            <ErrorPage message = {props.active}/>
        </Modal>
    )
}

export default ErrorPage