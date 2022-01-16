import React, { useEffect } from 'react';
import "antd/dist/antd.css";
import './App.css'
import LoginPage from './Components/LoginPage/LoginPage';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import CreateNewUserPage from './Components/CreateNewUserPage/CreateNewUserPage';
import { actions as authuser_actions, amIAuthorizedTC } from './redux/authReducer';
import { connect } from 'react-redux';
import { auth_user_selectors, error_handler_selectors } from './Selectors/selectors';
import GameStats from './Components/Content/GameStats/GameStats';
import ChampionshipPage from './Components/Content/ChampionshipPage/ChampionshipPage';
import ChampionshipsPage from './Components/Content/ChampionshipsPage/ChampionshipsPage';
import BetStatisticPage from './Components/Content/BetStatisticPage/BetStatisticPage';
import ProfilePage from './Components/ProfilePage/ProfilePage'
import EmptyPage from './Components/CommonComponents/PreloaderPage/PreloaderPage'
import { useSubscribeOnData } from './Hooks/Hooks';
import MyNetMainPage from './Components/Content/MyNetMainPage/MyNetMainPage'
import store, { AppStoreType } from './redux/redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { actions as error_handler_actions } from './redux/error_handler_reducer';
import ErrorPage, { ModalErrorPage } from './Components/CommonComponents/ErrorPage/ErrorPage';
import WelcomeNewUserPage from './Components/WelcomeNUPage/WelcomeNUPage';
import { BackTop, Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import MyHeader from './Components/Header/Header';
import MyFooter from './Components/Footer/Footer';
import PageNotFound from './Components/CommonComponents/PageNotFound';
import PredictionBoard from './Components/Content/PredictionBoard/PredictionBoard';

type AppPropsType = MapStateToPropsType & MapDispatchToProps

let App: React.FC<AppPropsType> = ({set_error_message, ...props}) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0)
    set_error_message(null)
  }, [pathname, set_error_message]);

  useEffect(() => {
    window.addEventListener('unhandledrejection', (e) => { set_error_message(e.reason.message) })
    return window.removeEventListener('unhandledrejection', (e) => { set_error_message(e.reason.message) })
  }, [set_error_message])

  useSubscribeOnData(props.amIAuthorizedTC, null, [])
  return <RootComponent {...props} />
}

type RootComponentPropsType = {
  isLogingUser: boolean
  error_message: string[] | null
  authorization_warning_message: string[] | null
  warning_messages: string[] | null
  set_authorization_error: typeof authuser_actions.setWarningMessage
  set_warning_messages: typeof error_handler_actions.set_warning
}

const RootComponent: React.FC<RootComponentPropsType> = (props) => {
  if (props.isLogingUser) return <EmptyPage />
  return (
    <Layout className="layout">
      <MyHeader />
      <Content style={{ padding: '0 50px'}}>
        <div className="site-layout-content" style = {{minHeight: '80vh'}}>
          {props.error_message && <ErrorPage message={props.error_message} />}
          {!props.error_message && <div className='app-wrapper-content' >
            <Switch>
              <Route exact path='/' render={() => <Redirect to = '/mainPage' />} />
              <Route exact path='/welcome_new_user' component={WelcomeNewUserPage} />
              <Route exact path='/profile_page' component={ProfilePage} />
              <Route exact path='/loginpage' component={LoginPage} />
              <Route exact path='/createnewuserpage' component={CreateNewUserPage} />

              <Route exact path='/championships' component={ChampionshipsPage} />
              <Route exact path='/championships/:db_name' component={ChampionshipPage} />
              <Route exact path='/championships/:db_name/:kind_of_bet/:type_of_bet' component={BetStatisticPage} />

              <Route exact path='/game_stats/:db_name/:game_id' component={GameStats} />
              <Route exact path='/mainPage/:date_of_prediction?' component={MyNetMainPage} />
              <Route exact path='/prediction_board' component={PredictionBoard} /> 
              <Route path = '*' component = {PageNotFound}/> 
            </Switch>
          </div>}
          <ModalErrorPage active={props.authorization_warning_message}
            close_modal={() => { props.set_authorization_error(null) }} />
          <ModalErrorPage active={props.warning_messages}
            close_modal={() => { props.set_warning_messages(null) }} />
          <BackTop />
        </div>
      </Content>
      <MyFooter />
    </Layout>
  );

}

let mapDispatchToProps = {
  amIAuthorizedTC,
  set_error_message: error_handler_actions.set_error,
  set_warning_messages: error_handler_actions.set_warning,
  set_authorization_error: authuser_actions.setWarningMessage
}

type MapDispatchToProps = {
  amIAuthorizedTC: () => void
  set_error_message: typeof error_handler_actions.set_error
  set_warning_messages: typeof error_handler_actions.set_warning
  set_authorization_error: typeof authuser_actions.setWarningMessage
}

let mapStateToProps = (state: AppStoreType) => {
  return {
    isLogingUser: auth_user_selectors.get_is_logging_user(state),
    error_message: error_handler_selectors.get_error_message(state),
    warning_messages: error_handler_selectors.get_warning_messages(state),
    authorization_warning_message: auth_user_selectors.get_warning_message(state)
  }
}

type MapStateToPropsType = ReturnType<typeof mapStateToProps>

const ConnectedApp = connect<MapStateToPropsType, MapDispatchToProps, {}, AppStoreType>(mapStateToProps, mapDispatchToProps)(App);

let AppContainer = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    </BrowserRouter>
  )
}

export default AppContainer
