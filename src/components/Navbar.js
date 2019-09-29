import React from 'react'
import { NavLink,Link,withRouter } from "react-router-dom";
import {withGetScreen} from 'react-getscreen'
import {AuthContext} from '../authenticationContext';
import "../styles/navbar.css"
import {removeSessionCookie} from '../session'
import $ from 'jquery';

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {searchValue: ''}
        this.handleSearchValue = this.handleSearchValue.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    }
    componentDidMount() {
        $('.navbar-collapse .navbar-nav .nav-item a').on('click', function () {
             $('.navbar-toggler').click() //bootstrap 3.x  
        });    
    }
    handleSearchValue(event) {
        this.setState({searchValue: event.target.value})
    }
    handleSearchSubmit(){
        if(this.state.searchValue) { // if (not null, not undefined,not empty, not zero, not false  )
            document.getElementById('search-movie-input').value = ''
            this.setState({searchValue: ''})
            this.props.history.push({pathname: '/film-ara',search: `?q=${this.state.searchValue}&page=1`})
        }
    }
    render() {
        return(
            <nav id="headerNavbar" className="navbar navbar-expand-lg navbar-dark sticky-top">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link to="/" className="navbar-brand" id="logo">
                        <i className="fa fa-film mr-2"></i>MyMoviex
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarToggler">
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li className="nav-item">
                                <NavLink exact to={{pathname:'/vizyondaki-filmler', search: '?page=1'}} className="nav-link" activeClassName="active">Vizyondakiler</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact to={{pathname:'/populer-filmler', search: '?page=1'}} className="nav-link" activeClassName="active">Popüler</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact to={{pathname:'/en-begenilen-filmler', search: '?page=1'}} className="nav-link" activeClassName="active">En Beğenilenler</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact  to={{pathname:'/yakindaki-filmler', search: '?page=1'}} className="nav-link" activeClassName="active">Pek Yakında</NavLink>
                             </li> 
                        </ul>
                        <NavbarUserLink/>
                        <div className="form-inline">
                            <input id="search-movie-input" className="form-control mr-sm-2" type="search" placeholder="Bir Film Ara..." value={this.state.searchValue} onChange={this.handleSearchValue} aria-label="Search"/>
                            <button className="btn btn-outline-info my-2 my-sm-0" onClick={this.handleSearchSubmit}>Ara</button>     
                       </div>                          
                    </div>
                </div>
          </nav>
        )
    }
}




function AuthenticationLinks(props) {
    return(
        <ul className="navbar-nav ml-auto mr-3">
            <li className="nav-item">
              <NavLink exact to='/uyelik/giris' className="nav-link" activeClassName="active">Giriş Yap</NavLink>
            </li>
            <li className="nav-item">
                <NavLink exact to='/uyelik/kaydol' className="nav-link" activeClassName="active">Kaydol</NavLink>
            </li>
       </ul>
    )
}
class NavbarUserLink extends React.Component {
    logOut() {
        removeSessionCookie();
        this.context.setAuth();
    }
    render() {
        const loginStatus = this.context.session.auth; // if session.auth === true or defined , this means user has logged in.
        console.log(loginStatus);
        if(!loginStatus) {
            return (
                <AuthenticationLinks/>
            )
        }
        else { // user logined succesfully
            return (
                <ul className="navbar-nav ml-auto mr-3 navbarUserLink">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown">Hoşgeldiniz</a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <Link to='/favori-filmlerim?page=1' className="btn btn-link dropdown-item">Favoriler</Link>
                            <button onClick={this.logOut.bind(this)} className="btn btn-link dropdown-item">Çıkış Yap</button>
                        </div>
                    </li>
                </ul>               
            )
        }

    }
}
NavbarUserLink.contextType = AuthContext;

export default withRouter(withGetScreen(Navbar))