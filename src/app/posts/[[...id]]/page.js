import parse from 'html-react-parser'
import microcms from "@/share/microcms";

export async function generateStaticParams() {
  const data = await microcms.get({endpoint: "posts",fields:"title,updatedAt"})
  //console.log(data)
  const paths = data.contents.map((post) => ({id: [post.id.toString()],}));
  return paths
}

export default async function FirstPost(params) {
  const ids = params.params.id
  const post = await microcms.get({endpoint: "posts",contentId:ids[0]})

  return (
    <div>
      <div id="main-content">{parse(post.content)}</div>
    </div>
  );
}
