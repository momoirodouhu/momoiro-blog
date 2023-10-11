"use client"
import styles from "./PostLink.module.scss"

export default function Post_link({id}){
    return (
        <div className={styles.postlink}>
            <img className={styles.postimg} src="https://dummyimage.com/600x400/333/fff&text=there+is+no+image"></img>
            <div className={styles.info}>
                post: unknown post id
            </div>
        </div>
    )
}