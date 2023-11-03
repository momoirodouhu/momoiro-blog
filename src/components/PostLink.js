"use client"
import global_styles from "@/share/global.module.scss"
import styles from "./PostLink.module.scss"

export default function Post_link({id}){
    var path = "/posts/" + id
    return (
        <a href={path} className={`${styles.postlink} ${global_styles.box}`}>
            <img className={styles.postimg} src="https://dummyimage.com/1200x630/333/fff&text=there+is+no+image"></img>
            <div className={styles.info}>
                post: {id}
            </div>
        </a>
    )
}