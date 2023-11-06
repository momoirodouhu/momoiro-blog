import microcms from "@/share/microcms";
import global_styles from "@/share/global.module.scss"
import styles from "./PostLink.module.scss"

export default async function Post_link({id}){
    const post = await microcms.get({endpoint: "posts",contentId:id})
    return (
        <a href={"/posts/"+id} className={`${styles.postlink} ${global_styles.box}`}>
            <img className={styles.postimg} src={post.eyecatch?.url || "https://dummyimage.com/1200x630/333/fff&text=there+is+no+image"}></img>
            <div className={styles.info}>
                <h3>{post.title}</h3>
            </div>
        </a>
    )
}