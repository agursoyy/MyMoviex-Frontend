import React from 'react'
import '../styles/home.css'
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.name = 'alp'
    }
    render() {
        return(
            <div id="home">
                Home
            </div>
        )
    }
}
export default Home