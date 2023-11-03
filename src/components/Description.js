import global_styles from "@/share/global.module.scss"
import styles from "./Description.module.scss"
import DateTimeObj from "@/components/DateTimeObj"

export default function description({post}) {
    return (
        <div className={`${styles.desc} ${global_styles.box}`}>
            <img className={styles.descimg} src={post.eyecatch?.url || "https://dummyimage.com/1200x630/333/fff&text=there+is+no+image"}/>
            <h1 className={styles.title}>{post.title}</h1>
            <p>update: <DateTimeObj date={post.updatedAt}/></p>
        </div>
    )
}