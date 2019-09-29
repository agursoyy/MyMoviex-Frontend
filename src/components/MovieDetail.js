import React from 'react'
import Axios from 'axios'
import {withRouter} from 'react-router-dom'
import '../styles/movieDetail.css'
import Loading from './Loading'
import AddFavorites from './AddFavorites'
import ModalVideo from 'react-modal-video'
import YoutubePlay from './YoutubePlay';

class movieDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state= {loading: true,movie: {}, youtube: false, trailerID: ''}
        this.apiKey = "f9261403d3de49a0151e3debf139d4b6"
        this.imgUrl = "https://image.tmdb.org/t/p/w300/"
        this.backdropUrl = "https://image.tmdb.org/t/p/original/"
        this.backdropImg = ''
    }
    componentDidMount() {
        console.log(this.props);
        new Promise((resolve,reject) => {
            this.fetchMovie()
            resolve()
        }).then(()=>{this.loading()}) 
    }
    loading() {
        setTimeout(() => {
            this.setState({loading: false})
        }, 800);
    }
    isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    moviePoster() {
        var img;
        if(this.state.movie.poster_path == null)
            img = <img src={require('../assets/notFoundPoster.png')} className="movie-posterNotFound-img" alt="poster"/>
        else
            img = <img src={this.imgUrl + this.state.movie.poster_path} className="moviedetail-poster" alt="poster"/>
        return img
    }
    getQueryMovieID() {
        return this.props.match.params.movie_id;
    }
    getMovieUrl() {
        var url = `https://api.themoviedb.org/3/movie/${this.getQueryMovieID().toString()}?api_key=${this.apiKey}&language=tr`
        return url;
    }
    notFoundRedirect() {
        this.props.history.push("/404")
    }
    fetchMovie() {
        Axios.get(this.getMovieUrl())  // returns a promise function
        .then(response => {
            this.setState({movie: response.data}) // get movie
        })
        .then(()=> {
            this.getTrailerID();  // get trailer id.
        })
        .catch(err => {
            if(err.response) {
                // or if(err.response.status === 404)
               if(err.response.data.status_code === 34 )  // when 404 occurs, tmdb sends 34 as a response DATA.
                    this.notFoundRedirect();
            }
        })     
    }
    getTrailerID() {  /* if exists, get trailer published in Turkish. Otherwise, get in any language. */
        var movieID = this.state.movie.id;
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
    genresJsx() {
        if(this.state.movie.genres!=null) {
            let genreList =this.state.movie.genres.map((item,index) => <span key={index}>{item.name}{index !== this.state.movie.genres.length-1 ? ', ' : ''}</span>)
             return <div className="genres">{genreList}</div>
        }
    }
    handleYoutubeButton() {
        this.setState({youtube: true})
    }
    
    render() {
        let img = this.moviePoster()
        return (
            <>
                <div style={{display: this.state.loading ? 'block' : 'none' }}>
                    <Loading />
                </div>
                <div id="moviedetail-page">
                    <div id="moviedetail" className="container" style={{ backgroundImage: this.state.movie.backdrop_path ? `url(${this.backdropUrl+this.state.movie.backdrop_path})` : ''}}>
                                <div className="row content">
                                    <div className="col-md-3 d-none d-md-block imgContainer">
                                        {img}
                                    </div>
                                    <div className="col-md-8 movie-info p-4">
                                            <div className="d-flex justify-content-between">
                                                <div className="movie-title">{this.state.movie.title}</div>

                                            </div>
                                            {this.genresJsx()}
                                            <div className="button-groups d-flex">
                                                <div className="mr-2"><AddFavorites movie = {this.state.movie}/></div>
                                                <div><YoutubePlay onClick = {this.handleYoutubeButton.bind(this)}/>

                                                </div>

                                            </div>
                                            <hr/>

                                            <ul className="star-release">
                                                <li>
                                                <i className="fa fa-star mr-1 star-icon mr-1" aria-hidden="true"></i>
                                                {this.state.movie.vote_average}
                                                </li>
                                                <li>
                                                    <span className="release-date">{this.state.movie.release_date}</span>
                                                </li>
                                            </ul>
                                            <p className="overview">
                                            <b>Özet: </b>{this.state.movie.overview}
                                            </p>
                                    </div> 
                                </div>
                    </div>  
                    <ModalVideo channel='youtube' isOpen={this.state.youtube} videoId={this.state.trailerID} onClose={() => this.setState({youtube: false})} />
                </div>
            </>

        )
              
        

    }
}

export default withRouter(movieDetail);