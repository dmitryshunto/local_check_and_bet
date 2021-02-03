import React from 'react'
import classes from './Footer.module.css'

const Footer = () => {
    return (
        <footer>
            <div className = {classes.footer_content}>
                <h3>checkandbet</h3>
                <p>&copy; 2020 checkandbet. Все права защищены.</p>
            </div>
        </footer>
    )
}

export default Footer