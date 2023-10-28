import parse from 'html-react-parser'
import { notFound } from 'next/navigation'
import microcms from "@/share/microcms";
import Header from '@/components/Header';
import ProfCard from "@/components/ProfCard"
import Description from '@/components/Description';
import PostLink from "@/components/PostLink"
import global_styles from "@/share/global.module.scss"
import styles from "./post.module.scss"

export async function generateStaticParams() {
  const paths = await microcms.getAllContentIds({endpoint: "posts",fields:"title,updatedAt"})
  //console.log(paths)
  return paths
}

const replace = (node) => {
  if (node.name === 'img') {
    node.attribs["class"] = ( node.attribs["class"] ?? "" ) + " " + styles.imgcontent
  }
}

export default async function FirstPost(params) {
  const ids = params.params.id
  const post = await microcms.get({endpoint: "posts",contentId:ids[0]}).catch(() => {return notFound()})

  return (
    <div>
      <Header/>
      <div id="main" className={global_styles.main}>
        <div className={global_styles.info}>
          <Description post={post}></Description>
          <ProfCard/>
        </div>
        <div id="content" className={styles.content}>
          {parse(post.content,{ replace })}
        </div>
      </div>
    </div>
  );
}
