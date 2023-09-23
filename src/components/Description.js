import styles from "./Description.module.scss"
import DateTimeObj from "@/components/DateTimeObj"

export default function description({post}) {
    console.log(post)
    return (
        <div className={styles.desc}>
            <img src={post.eyecatch.url}/>
            <h1 className={styles.title}>{post.title}</h1>
            <p>update: <DateTimeObj date={post.updatedAt}/></p>
        </div>
    )
}