import parse from 'html-react-parser'
import microcms from "@/share/microcms";
import Header from '@/components/Header';
import ProfCard from "@/components/ProfCard"
import Description from '@/components/Description';
import styles from "./post.module.scss"

export async function generateStaticParams() {
  const data = await microcms.getAllContentIds({endpoint: "posts",fields:"title,updatedAt"})
  //console.log(data)
  //const paths = data.contents.map((post) => ({id: [post.id.toString()],}));
  const paths = data;
  return paths
}

export default async function FirstPost(params) {
  const ids = params.params.id
  const post = await microcms.get({endpoint: "posts",contentId:ids[0]})

  return (
    <div>
      <Header></Header>
      <div id="main" className={styles.main}>
        <div className={styles.info}>
          <Description post={post}></Description>
          <ProfCard></ProfCard>
        </div>
        <div id="content" className={styles.content}>{parse(post.content)}</div>
      </div>
    </div>
  );
}
