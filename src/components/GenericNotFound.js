import React from 'react'
import styles from '../styles/notFound.module.css'
class Movie extends React.Component {

    render() {
        return (
        <div>
            <h1 className={`${styles.myClassName} ${styles.notFoundContainer}`}>404 Not Found</h1>
            <div className={styles.ali}>
              <h2 className={styles.alp}>asfas</h2>
            </div>

        </div>
            
        )
    }
}

export default Movie