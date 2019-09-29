import React from 'react'
import queryString from 'query-string'  
import Axios from 'axios'
import {Pagination} from 'react-js-pagination'
import {withGetScreen} from 'react-getscreen'
import Loading from './Loading'
import Movie from './Movie'
class SearchMovie extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loading: true,movies: [],totalPages: null,currentPage: 1}
    }
    componentDidMount() {
        this.fetchMovies();
        console.log(this.movies);
    }
    componentDidUpdate(prevProps) {
        if(prevProps.location.search !== this.props.location.search) {  // not object comparision (objeler eşit olamaz sürekli yeni obje oluşur)
            this.fetchMovies();
        }
    } 
    getQueryValues() {
        const values = queryString.parse(this.props.location.search)
        return values
    }
    getQueryName() {
        return this.getQueryValues().q
    }
    getCurrentPage() {
        return this.getQueryValues().page
    }
    fetchMovies() {
        let page = this.getCurrentPage();
       if(!page)
            page = 1
        // return Promise Object
        return Axios.get('https://api.themoviedb.org/3/search/movie?api_key=f9261403d3de49a0151e3debf139d4b6&language=tr&query=' + this.getQueryName() + '&page=' + page)
        .then(response => {
          this.setState({loading: true,movies: response.data.results, currentPage: page,totalPages: (parseInt(response.data.total_pages))})
          setTimeout(() => {
            this.setState({loading: false})
          }, 1000);
        })
        .catch(err=> {
            //this.notFoundRedirect()  // query failed.
            console.error(err)
        }) 
    }
    notFoundRedirect() {
        this.props.history.push("/404")
    }
    handlePageChange() {
        console.log('page')
    }
    render() {
            let movieList = this.state.movies.map((m,index)=><div key={index} className="col-lg-3 col-md-4 col-6 mb-4"><Movie data={m}/></div>)
            console.log(movieList);
                        
            return(
            <>
                <div style={{display: this.state.loading ? 'block' : 'none' }}>
                    <Loading />
                </div>
                <div className="movielist-page">
                    <div className="movieList-container container">
                        <h3 className="page-title">Arama Sonucu: {this.getQueryName()}</h3>
                        <div className="row">
                                {movieList}
                        </div>
                    
                    </div>
                </div>
            </>
          
            )
       
    }
}
export default withGetScreen(SearchMovie)