import global_styles from "@/share/global.module.scss"
import Header from "@/components/Header"
import ProfCard from "@/components/ProfCard"

export default function About() {
    return (
        <div>
            <Header />
            <div className={global_styles.main}>
                <div className={global_styles.info}>
                    <ProfCard />
                </div>
                <div>
                    <h3>
                        sorry. this site is japanese only
                    </h3>
                    <p>はい。とりあえずで制作してる謎のブログです。そんなに更新はしないと思いますが許してください。</p>
                    <p>まあ、基本的に雑多な (主に技術系のことを) 物事を、徒然なるまま書き留めることになると思います。</p>
                    <p style={{textDecoration:"line-through"}}>ちょっとActivityPubに対応させてみたいな、とか考えてたり</p>
                </div>
            </div>
        </div>
    )
}
