import styles from "./root-index.module.scss"
import global_styles from "@/share/global.module.scss"
import microcms from "@/share/microcms"
import Header from "@/components/Header"
import ProfCard from "@/components/ProfCard"
import PostLink from "@/components/PostLink"

export default async function Home() {
  var posts = await microcms.getAllContents({endpoint: "posts"})
  posts = posts.map((post) => {return post.id})
  console.log(posts)
  return (
    <div>
      <Header/>
      <div className={global_styles.main}>
        <div className={global_styles.info}>
          <ProfCard/>
        </div>
        <div className={styles.post_list}>
          {posts.map((post_id,index) => <PostLink id={post_id} key={index}/> )}
        </div>
      </div>
    </div>
  )
}
