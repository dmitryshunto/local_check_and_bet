import React from 'react';
import classes from './Header.module.css';
import { Link } from 'react-router-dom';
import { auth_user_selectors } from '../../Selectors/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserTC } from '../../redux/authReducer';
import { Button, Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';

const MyHeader: React.FC = () => {
    const login = useSelector(auth_user_selectors.get_login)
    return (
        <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal">
                <Menu.Item key="1"><Link to='/my_net_main_page'>Main Page</Link></Menu.Item>
                <Menu.Item key="2"><Link to='/championships'>Leagues</Link></Menu.Item>
                {login ? <Menu.Item key="3">
                    <MyProfileLink login={login} />
                </Menu.Item>
                    : <>
                        <Menu.Item key="4">
                            <Link to='/loginpage'>Login</Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to='/createnewuserpage'>Register</Link>
                        </Menu.Item>
                    </>
                }
            </Menu>
        </Header>
    )
}

type MyProfileLinkType = {
    login: string
}

const MyProfileLink: React.FC<MyProfileLinkType> = ({ login }) => {

    const dispatch = useDispatch()
    const logoutUser = () => {
        dispatch(logoutUserTC())
    }
    return (
        <div className={classes.my_profile_item}>
            <div><Link style={{ color: "rgba(255, 255, 255, 0.65)" }} className={classes.my_profile_link} to='/profile_page'>
                {login}
            </Link></div>
            <div><Button onClick={logoutUser}>Log out</Button></div>
        </div>
    )
}

export default MyHeader