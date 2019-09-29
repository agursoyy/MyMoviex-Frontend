import React from 'react';
import Axios from 'axios';
import {AuthContext} from '../authenticationContext';
import styles from '../styles/addFavorites.module.css';
import { withRouter } from "react-router";

class AddFavorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true,isFavorite: false}
        this.addFavorites = this.addFavorites.bind(this);
        this.removeFromFavorites = this.removeFromFavorites.bind(this);
    }
    componentDidMount() {
        this.isFavorite();  // check if it's already added to favorites.
    }
    addFavorites() {
        if(this.context.session.auth) {
            this.setState({loading: true});
            let movie = this.props.movie;
            Axios.post(process.env.REACT_APP_ADD_FAVORITE_URI,{
                movie: movie
            },
            {
                method: 'POST',
                headers: {
                    'x-access-token': this.context.session.token
                }
            })
            .then(response => {
                this.setState({isFavorite: true,loading: false});
                console.log(response);
            })
            .catch( err => {
                console.error(err)
                console.log(err.response)
            })
        }
        else {
            this.props.history.push('/uyelik/giris',{next: this.props.next});
        }
    }
    removeFromFavorites() {
        if(this.context.session.auth) {
            this.setState({loading: true});
            let movieId = this.props.movie.id;
            Axios.delete(process.env.REACT_APP_REMOVE_FAVORITE_URI,{
                data: {
                    movieId: movieId
                },
                headers: {
                    'x-access-token': this.context.session.token
                }
            })
            .then(response => {
                this.setState({isFavorite: false,loading: false});
                console.log(response);
            }).then(() => {
                this.props.refreshMovieList();
            })
            .catch( err => {
                console.error(err)
                console.log(err.response)
            })
        }
    }
    isFavorite() {
        console.log(this.context.session.auth);
        if(this.context.session.auth) {
            let movieId = this.props.movie.id;
            Axios.get(process.env.REACT_APP_FAVORITE_IDS_URI ,{
                method: 'GET',
                headers: {
                    'x-access-token': this.context.session.token
                }
            })
            .then(response => {
                const favorites = response.data.results;
                for(var i = 0; i < favorites.length; i++) {
                    if(favorites[i] === movieId){
                        this.setState({isFavorite: true});
                        break;
                    }
                }
            }).then(() => {
                this.setState({loading: false});
            })
            .catch( err => {
                console.error(err)
            })
        }
        else  
            this.setState({loading: false});
    }
    render() {
        if(this.state.loading) {
            return(
                <i className={`fas fa-spinner fa-spin ${styles.spinnerLoading}`}></i>
            )
        }
        else if(this.state.isFavorite) // movie has been added to favorites
            return(
                <i className={`fas fa-heart ${styles.unfavButton}`} onClick={this.removeFromFavorites}></i>
            )
        else 
            return(
                <i className={`far fa-heart ${styles.favButton}`} onClick={this.addFavorites}></i>                 
            )
    }
}


AddFavorites.contextType = AuthContext; 
export default withRouter(AddFavorites);