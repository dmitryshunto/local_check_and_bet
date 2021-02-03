import React from 'react';
import classes from './PreloaderPage.module.css';
import Preloader from '../Preloader/Preloader';

const PreloaderPage: React.FC = () => {
    return (
        <div className={classes.empty_page}>
            <div className={classes.empty_page_header} />
            <PreloaderPageWithoutHeader />
        </div>
    )
}

export const PreloaderPageWithoutHeader: React.FC = () => {
    return (
        <div className={classes.empty_page_content}>
            <Preloader />
        </div>
    )
}

export default PreloaderPage