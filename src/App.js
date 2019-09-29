import React,{lazy,Suspense} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary'
import Login from './components/Login'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import MovieList from './components/MovieList'
import MovieApi from './movieApi'
import MovieDetail from './components/MovieDetail'
import SearchMovie from './components/SearchMovie'
import GenericNotFound from './components/GenericNotFound'
import ChangePassword from './components/ChangePassword';
import ForgetPassword from './components/ForgetPassword';
import {AuthContext} from './authenticationContext'; 
import {getSessionCookie, setSessionCookie} from './session';
import './App.css'
import './App.scss'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: getSessionCookie(),
      setAuth: (session) => {
        if(session)
        {
          setSessionCookie(session); 
        }
        this.setState({session: getSessionCookie()});
      }
    }
  }
 
  render() {
    return (
      <AuthContext.Provider value = {this.state}>  { /* context is getSessionCookie() */}
        <div id="mainContent">
          <Router>
              <Navbar/> {/* react router link(s) should be included in <Router></Router> tagss */}
                <Switch> {/* router view will be switched here by url */}
                  <Route exact path="/uyelik/giris" component= {Login}/>
                  <Route exact path="/uyelik/kaydol" component= {Signup}/>
                  <Route exact path="/uyelik/sifremi-unuttum" component = {ForgetPassword}/>
                  <Route exact path="/uyelik/sifre-yenileme/:token" component = {ChangePassword}/>
                  <Route exact path="/vizyondaki-filmler" render={(props) =><ErrorBoundary><MovieList key="1" {...props} fetchUrl={MovieApi.nowPlayingURL} pageTitle="Vizyondaki Filmler"/></ErrorBoundary>} />
                  <Route exact path="/populer-filmler" render={(props) =><ErrorBoundary><MovieList key="2" {...props} fetchUrl={MovieApi.popularURL} pageTitle="Popüler Filmler"/></ErrorBoundary>} />
                  <Route exact path="/en-begenilen-filmler" render={(props) =><ErrorBoundary><MovieList key="3" {...props} fetchUrl={MovieApi.topRatedURL} pageTitle="En Beğenilen Filmler" /></ErrorBoundary>} />
                  <Route exact path="/yakindaki-filmler" render={(props) =><ErrorBoundary><MovieList key="4" {...props} fetchUrl={MovieApi.upcomingURL} pageTitle="Gelecekteki Filmler" /></ErrorBoundary>} />
                  <Route exact path="/:movieName-filmi/:movie_id" render = {(props) => <ErrorBoundary><MovieDetail {...props}/></ErrorBoundary>}/>
                  <Route exact path='/film-ara' render = {(props) => <ErrorBoundary><SearchMovie {...props}/></ErrorBoundary>}/>
                  <Route exact path="/favori-filmlerim" render = {(props) => <ErrorBoundary><MovieList key="5" {...props} localServer fetchUrl={process.env.REACT_APP_FAVORITE_MOVIES_URI} pageTitle="Favori Filmlerim"/></ErrorBoundary>}/>
                  <Redirect from = '//' to ={{pathname: '/vizyondaki-filmler', search: '?page=1'}}/>
                  <Route path='*' render = {(props) => <ErrorBoundary><GenericNotFound {...props}/></ErrorBoundary>} />

                </Switch>
          </Router>
        </div>
      </AuthContext.Provider>
    );
  }
}
export default App;
