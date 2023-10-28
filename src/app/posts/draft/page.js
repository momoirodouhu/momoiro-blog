import parse from "html-react-parser";
import microcms from "@/share/microcms";
import Header from "@/components/Header";
import ProfCard from "@/components/ProfCard";
import Description from "@/components/Description";
import global_styles from "@/share/global.module.scss";
import styles from "./draft.module.scss";

const replace = (node) => {
    if (node.name === "img") {
        node.attribs["class"] =
            (node.attribs["class"] ?? "") + " " + styles.imgcontent;
    }
};

export default async function FirstPost(params) {
    const ids = params.params.id;
    const post = await microcms.get({ endpoint: "posts", contentId: ids[0] });

    return (
        <div>
            <Header />
            <div id="main" className={global_styles.main}>
                <div className={global_styles.info}>
                    <Description post={post}></Description>
                    <ProfCard />
                </div>
                <div id="content" className={styles.content}>
                    {parse(post.content, { replace })}
                </div>
            </div>
        </div>
    );
}
