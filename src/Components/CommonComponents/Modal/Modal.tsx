import React from 'react'
import  classes from './Modal.module.css'

type PropsType = {
    active: boolean
    close_modal: (x: boolean) => void
}

const Modal: React.FC<PropsType> = ({active, close_modal, children}) => {
    return (
        <div className = {active ? classes.modal + ' ' + classes.active : classes.modal} onClick = {() => close_modal(false)}>
            <div className = {active ? classes.modal_content + ' ' + classes.active : classes.modal_content} onClick = {(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal