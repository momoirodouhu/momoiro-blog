import parse from 'html-react-parser'
import { notFound } from 'next/navigation'
import microcms from "@/share/microcms";
import Header from '@/components/Header';
import ProfCard from "@/components/ProfCard"
import Description from '@/components/Description';
import global_styles from "@/share/global.module.scss"
import styles from "./post.module.scss"

export async function generateStaticParams() {
  var paths = await microcms.getAllContentIds({endpoint: "posts",fields:"title,updatedAt"})
  paths = paths.map((post) => ({id: [post],}))
  return paths
}

const replace = (node) => {
  if (node.name === 'img') {
    node.attribs["class"] = ( node.attribs["class"] ?? "" ) + " " + styles.imgcontent
  }
}

export default async function FirstPost(params) {
  const ids = params.params.id
  const post = await microcms.get({endpoint: "posts",contentId:ids[0]})

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

export async function generateMetadata(params){
  const ids = params.params.id
  const post = await microcms.get({endpoint: "posts",contentId:ids[0]});
  console.log(post.title)
  return {title: post.title};
}