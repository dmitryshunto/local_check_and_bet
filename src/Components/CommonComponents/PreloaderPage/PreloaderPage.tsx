import React from 'react';
import classes from './PreloaderPage.module.css'
import { Spin } from 'antd';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import MyFooter from '../../Footer/Footer';

const PreloaderPage: React.FC = () => {
    return (
        <Layout className='layout'>
            <Header />
            <Content style={{ padding: '0 50px' }}>
                <div className="site-layout-content">
                    <PreloaderPageWithoutHeader />
                </div>
            </Content>
            <MyFooter />
        </Layout>
    )
}

export const PreloaderPageWithoutHeader: React.FC = () => {
    return (
        <div className = {classes.preloader}>
            <Spin size={'large'} />
        </div>
    )
}

export default PreloaderPage