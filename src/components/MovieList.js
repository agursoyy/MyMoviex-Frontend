import React,{Suspense,lazy} from 'react'
import '../styles/movielist.css'
import Axios from 'axios'
import Loading from './Loading'
import Pagination from "react-js-pagination"
import {withGetScreen} from 'react-getscreen'
import queryString from 'query-string'  
import {AuthContext} from '../authenticationContext';
import { animateScroll as scroll} from 'react-scroll'

//import Movie from './Movie'  ---> normal import
const Movie = lazy(() => import('./Movie'))    // ---> loadable import


class MovieList extends React.Component {
    constructor(props) {
        super(props)
        this.state= {movies: [],currentPage: 1, loading: true,activePage: 1}
        this.totalPages = null
        this.handlePageChange = this.handlePageChange.bind(this)
    }
    componentDidMount() {
        this.redirect(); 
        this.fetchMovies()
    } 
   componentDidUpdate(prevProps) {
        if(prevProps.location.search !== this.props.location.search) {
            this.fetchMovies();
        }
    }
    scrollToTop() {
        scroll.scrollToTop();
      }
    getQueryValues() {
        const values = queryString.parse(this.props.location.search)
        return values
    }
    getCurrentPage() {
        if(!this.getQueryValues().page)
            return 1
        else
            return this.getQueryValues().page
    }
    fetchMovies() {
        let headers = {};
        if(this.props.localServer) {
            headers = { 
                method: 'GET',
                headers: {
                    'x-access-token': this.context.session.token
                }
            };
        }
         Axios.get(this.props.fetchUrl +"&page=" + this.getCurrentPage(),headers)
        .then(response=>{
            console.log(response.data);
            this.setState({loading:true, movies: response.data.results,currentPage: this.getCurrentPage()})
            this.totalPages = response.data.total_pages

         }).then(()=> {
            this.scrollToTop();
            setTimeout(() => {
                this.setState({loading: false});
            }, 1000);
         }).catch(error => {
            console.log(error);
          });
    }
    refreshMovieList() {
        if(this.props.localServer) {
            /*this.setState({loading: true});
            */
           this.fetchMovies();
            window.location.reload(); // more logical solution will be thought.
        }
    }
    handlePageChange(pageNumber) {
        console.log('handled' +pageNumber);
        var currentUrl = this.props.location.pathname
        var arr = currentUrl.split('/')
        var url = `/${arr[1]}?page=${pageNumber.toString()}`
        this.props.history.push(url)
    }
    redirect() {
        if(this.props.localServer && !this.context.session.auth) {
            this.props.history.push('/uyelik/giris');
        }
    }
    render() {
     
            let movieList = this.state.movies.map((m,index)=><div key={index} className="col-lg-3 col-md-4 col-6 mb-4">
               <Suspense fallback={<div>Loading...</div>}><Movie refreshMovieList={this.refreshMovieList.bind(this)} data={m}/></Suspense>
                </div>)
            return(
                <>
                <div style={{display: this.state.loading ? 'block' : 'none' }}>
                    <Loading />
                </div>
                <div className="movielist-page">
                    <div className="movieList-container container">
                        <h4 className="page-title">{this.props.pageTitle}</h4>
                        <div className="row">
                                {movieList}
                        </div>
                        <div className="pagination mt-3">
                            <Pagination
                            activePage={this.state.currentPage}
                            itemsCountPerPage={20}
                            totalItemsCount={20*this.totalPages}
                            pageRangeDisplayed={this.props.isMobile() ? 3 : (this.props.isTablet() ? 5 : 12)}
                            onChange={this.handlePageChange}
                            />
                        </div>
                    </div>
                </div>
                </>
               
            )
        
    }
}
MovieList.contextType = AuthContext; 
export default withGetScreen(MovieList)