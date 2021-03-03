import React, { useEffect } from 'react';
import './App.css';
import LoginPage from './Components/LoginPage/LoginPage';
import {Route, Switch, useLocation} from 'react-router-dom';
import CreateNewUserPage from './Components/CreateNewUserPage/CreateNewUserPage';
import Header from './Components/Header/Header';
import { actions as authuser_actions, amIAuthorizedTC } from './redux/authReducer';
import { connect } from 'react-redux';
import { auth_user_selectors, error_handler_selectors } from './Selectors/selectors';
import MainPage from './Components/Content/MainPage/MainPage';
import GameStats from './Components/Content/GameStats/GameStats';
import ChampionshipPage from './Components/Content/ChampionshipPage/ChampionshipPage';
import ChampionshipsPage from './Components/Content/ChampionshipsPage/ChampionshipsPage';
import BetStatisticPage from './Components/Content/ChampionshipPage/ChampionshipBetsTable/BetStatisticPage/BetStatisticPage';
import ProfilePage from './Components/ProfilePage/ProfilePage'
import EmptyPage from './Components/CommonComponents/PreloaderPage/PreloaderPage';
import { useSubscribeOnData } from './Hooks/Hooks';
import Footer from './Components/Footer/Footer';
import MyNetMainPage from './Components/Content/MyNet/MyNetMainPage/MyNetMainPage'
import store from './redux/redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { actions as error_handler_actions } from './redux/error_handler_reducer';
import ErrorPage, { ModalErrorPage } from './Components/CommonComponents/ErrorPage/ErrorPage';

let App = (props) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0)
    props.set_error_message(null)
  }, [pathname]);

  useEffect(() => {
    window.addEventListener('unhandledrejection', (e) => {props.set_error_message(e.reason.message)})
    return window.removeEventListener('unhandledrejection', (e) => {props.set_error_message(e.reason.message)})
  }, [])

  useSubscribeOnData(props.amIAuthorizedTC, null, [])
  return <RootComponent {...props}/>
}

const RootComponent = (props) => {
  if(props.isLogingUser) return <EmptyPage />
  return (
    <div className='app-wrapper'>
      <Header />
      {props.error_message && <ErrorPage message = {props.error_message}/>}
      {!props.error_message && <div className='app-wrapper-content' >
        <Switch>
          
          <Route exact path='/profile_page' component={ProfilePage} />
          <Route exact path='/loginpage' render={() => <LoginPage />} />
          <Route exact path='/createnewuserpage' render={() => <CreateNewUserPage />} />
  
          <Route exact path='/championships' component={ChampionshipsPage} />
          <Route exact path='/championships/:name_of_championship' component={ChampionshipPage} />
          <Route exact path='/championships/:name_of_championship/:kind_of_bet/:type_of_bet' component={BetStatisticPage} />
  
          <Route exact path='/game_stats/:name_of_championship/:games_id' component={GameStats} />
          <Route exact path='/my_net_main_page/:date_of_prediction?' component = {MyNetMainPage}/>

          <Route path='/:date_of_prediction?' component={MainPage} />
          
        </Switch>
      </div>}
      <ModalErrorPage active = {props.authorization_warning_message} 
                      close_modal = {() => {props.set_authorization_error(null)}}/>
      <Footer />
    </div>
  );

}

let mapDispatchToProps = {
  amIAuthorizedTC,
  set_error_message: error_handler_actions.set_error,
  set_authorization_error: authuser_actions.setWarningMessage
}

let mapStateToProps = (state) => {
  return {
    isLogingUser: auth_user_selectors.get_is_logging_user(state),
    error_message: error_handler_selectors.get_warning_message(state),
    authorization_warning_message: auth_user_selectors.get_warning_message(state)
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

let AppContainer = (props) => {
  return (
    <BrowserRouter basename = {process.env.PUBLIC_URL}>
        <Provider store = {store}>
          <App {...props}/>
        </Provider>
    </BrowserRouter>
  )
}

export default AppContainer
