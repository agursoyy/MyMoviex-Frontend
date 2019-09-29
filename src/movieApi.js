const baseURL = 'https://api.themoviedb.org/3/movie'
const apiKey = 'api_key=f9261403d3de49a0151e3debf139d4b6'
const language = 'language=tr'
const popularURL = `${baseURL}/popular?${apiKey}&${language}`
const nowPlayingURL = `${baseURL}/now_playing?${apiKey}&${language}`
const topRatedURL = `${baseURL}/top_rated?${apiKey}&${language}`
const upcomingURL = `${baseURL}/upcoming?${apiKey}&${language}`
const genreURL = 'https://api.themoviedb.org/3/genre/movie/list?api_key=f9261403d3de49a0151e3debf139d4b6&language=tr'
const imageURL = 'https://image.tmdb.org/t/p/original'
export default {
    popularURL: popularURL,
    nowPlayingURL: nowPlayingURL,
    topRatedURL: topRatedURL,
    upcomingURL: upcomingURL,
    genreURL: genreURL,
    imageURL: imageURL,
}
