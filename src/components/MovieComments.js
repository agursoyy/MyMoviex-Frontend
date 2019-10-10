import React from 'react';
import styles from '../styles/movieComments.module.css';
class MovieComments extends React.Component {
    render() {
        return (
                    <div id="comment-container" className={ `container ${styles.commentContainer} ${this.props.bgColor ? styles.bgColor : ''}`}>
                        <h2 className={`${styles.postTitle}`}>Film hakkındaki düşüncenizi paylaşın</h2>
                        <div className={`${styles.commentBox}`}>
                                    <img src={require("../assets/img_avatar.png")} alt="Avatar" className={`${styles.avatar}`}/>
                                    <div className={`form-group ${styles.formGroup}`}>
                                        <textarea className={`form-control ${styles.commentInput}`} rows="3" placeholder="Lütfen sadece film hakkında hakaret içermeyen bir yorum yapınız."></textarea>
                                        <button className={`btn btn-block ${styles.postCommentBtn}`}>Gönder</button>
                                    </div>  
                        </div>
                        <div className={`${styles.postedComments}`}>
                             <h2 className={`${styles.postTitle} ${styles.postedTitle}`}>1 Yorum</h2>
                        </div>
                    </div>
        )
    }
}
export default MovieComments;