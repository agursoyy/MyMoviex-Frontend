import React from 'react'
import '../styles/movie.css'
import {withRouter} from 'react-router-dom'
import Axios from 'axios';
import AddFavorites from './AddFavorites';
import YoutubePlay from './YoutubePlay';
import ModalVideo from 'react-modal-video'

class Movie extends React.Component {
    constructor(props) {
        super(props)
        this.imgUrl = "https://image.tmdb.org/t/p/w300/"
        this.state = { imageLoaded: false,trailerID: '',youtube: false };
        this.handleMovieDetailButton = this.handleMovieDetailButton.bind(this)
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
    }
    com
    moviePoster() {
        var img;
        if(this.props.data.poster_path == null)
            img = <img src={require('../assets/notFoundPoster.png')} className="movie-posterNotFound-img" alt="poster"/>
        else
            img = <img src={this.imgUrl + this.props.data.poster_path} onLoad={this.handleImageLoaded} className="movie-img" alt="poster"/>
        return img
    }
    handleImageLoaded() {
        this.setState({ imageLoaded: true });
      }

    handleMovieDetailButton (event) {
        var movie = this.props.data
        var movieName = movie.title
        var movieID = movie.id
        var url = `/${this.removeSpaces(movieName)}-filmi/${movieID}`
        this.props.history.push(url);
    }
    removeSpaces(str) {
        return str.replace(/\s/g, '-')
    }
    handleFirstRender() {  /* since image from remote server not loading fully, movie-rollover element is not positioning correctly. */
        if(this.state.imageLoaded) {
            return 'none';
        }
        else 
            return 'none';
    }
    getTrailerID() {  /* if exists, get trailer published in Turkish. Otherwise, get in any language. */
        var movieID = this.props.data.id;
        var apiKey = "f9261403d3de49a0151e3debf139d4b6"
        let trailersUrl = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${apiKey}&language=tr`
       return Axios.get(trailersUrl).then(response => 
            {
                var videoIDs = response.data.results
                if(videoIDs && videoIDs[0]) {
                    console.log(videoIDs[0].key)
                    this.setState({trailerID: videoIDs[0].key})
                }
                else {
                    trailersUrl = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${apiKey}`;
                    Axios.get(trailersUrl).then(response => 
                        {
                            videoIDs = response.data.results;
                            if(videoIDs && videoIDs[0]) {
                                this.setState({trailerID: videoIDs[0].key})
                            }

                        }).catch(err=> {
                            console.error(err)
                    });  
                }
            }).catch(err=> {
                console.error(err)
            });  
    }
    handleYoutubeButton() {
        new Promise((resolve,reject) => {
            this.getTrailerID();
            resolve();
        }).then(()=> {
            setTimeout(()=> {
                this.setState({youtube: true});
            },500)  // getTrailerID has inner loops and setState methods, it can take much time.
        });
    }
    currentPage() {
        return this.props.location.pathname + this.props.location.search;
    }
    render() {
        let img = this.moviePoster()
        return (
        <div className="movie">
            <div className="movie-wrapper">
                    <div className="movie-img-container" onClick={this.handleMovieDetailButton}>
                        {img}
                    </div>
                    <div className="movie-related-links">
                        <AddFavorites movie = {this.props.data} refreshMovieList = {this.props.refreshMovieList} next = {this.currentPage()}/>
                        <YoutubePlay onClick = {()=>{this.handleYoutubeButton()}}/>
                    </div>
            </div>
            <div className="movie-title">{this.props.data.title}</div>
            <ModalVideo channel='youtube' isOpen={this.state.youtube} videoId={this.state.trailerID} onClose={() => this.setState({youtube: false})} />

        </div>
            
        )
    }
}
export default withRouter(Movie)