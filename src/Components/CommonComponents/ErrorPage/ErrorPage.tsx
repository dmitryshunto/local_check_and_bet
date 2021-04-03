import React from 'react';
import Modal, { ModalPropsType } from '../Modal/Modal';
import classes from './ErrorPage.module.css'


type OwnPropsType = {
    message: string | null | boolean | string[]
}

const ErrorPage: React.FC<OwnPropsType> = (props) => {
    let elems = null
    if(props.message) {  
        if(typeof props.message === 'object') {
            elems = props.message.map((e, i) => <h3 key = {i}>{e}</h3>)
        } else {
            elems = <h3>{props.message}</h3>
        }
    }
    return (
        <div className={classes.empty_page}>
            <h3>{elems}</h3>    
        </div>
    )
}

export const ModalErrorPage: React.FC<ModalPropsType> = (props) => {
    return (
        <Modal active = {props.active} close_modal = {props.close_modal}>
            <ErrorPage message = {props.active}/>
        </Modal>
    )
}

export default ErrorPage