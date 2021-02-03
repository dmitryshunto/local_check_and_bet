import React, { useEffect } from 'react';
import './App.css';
import LoginPage from './Components/LoginPage/LoginPage';
import {Route, Switch, useLocation} from 'react-router-dom';
import CreateNewUserPage from './Components/CreateNewUserPage/CreateNewUserPage';
import Header from './Components/Header/Header';
import { amIAuthorizedTC } from './redux/authReducer';
import { connect } from 'react-redux';
import { getIsLoggingUser } from './Selectors/selectors';
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

const AppContainer = (props) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useSubscribeOnData(props.amIAuthorizedTC, null, [])
  if(props.isLogingUser) return <EmptyPage />
  return <App {...props}/>
}

const App = () => {
  return (
    <div className='app-wrapper'>
      <Header />
      <div className='app-wrapper-content' >
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
      </div>
      <Footer />
    </div>
  );

}

let mapDispatchToProps = {
  amIAuthorizedTC
}

let mapStateToProps = (state) => {
  return {
    isLogingUser: getIsLoggingUser(state)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
