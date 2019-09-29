import React from 'react';
import styles from '../styles/youtubePlay.module.css'

export default class YoutubePlay extends React.Component {
  
    render() {
        return(
            <i className={`${styles.playLink} far fa-play-circle`} onClick={this.props.onClick}> </i>
        )
    }
}