import styles from "./root-index.module.scss"
import global_styles from "@/share/global.module.scss"
import microcms from "@/share/microcms"
import Header from "@/components/Header"
import ProfCard from "@/components/ProfCard"
import PostLink from "@/components/PostLink"

export default async function Home() {
  const posts = await microcms.getAllContentIds({endpoint: "posts",fields:"title,updatedAt"})
  return (
    <div>
      <Header/>
      <div className={global_styles.main}>
        <div className={global_styles.info}>
          <ProfCard/>
        </div>
        <div className={styles.post_list}>
          {posts.map((post_id,index) => <PostLink id={post_id} key={index}/> )}
          <PostLink id="123456"/>
          <PostLink id="123456"/>
          <PostLink id="123456"/>
          <PostLink id="123456"/>
        </div>
      </div>
    </div>
  )
}
