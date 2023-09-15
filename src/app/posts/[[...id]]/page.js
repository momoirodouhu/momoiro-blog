import parse from 'html-react-parser'
import microcms from "@/share/microcms";
import Header from '@/components/header';
import "@/share/global.scss";

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
      <div id="main-content">{parse(post.content)}</div>
    </div>
  );
}
