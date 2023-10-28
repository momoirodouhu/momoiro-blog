import global_styles from "share/global.module.scss"
import styles from "./ProfCard.module.scss"

export default function ProfCard(){
    return (
        <div className={`${styles.prof_card} ${global_styles.box}`}>
            <img src="/momoiro_avatar.png" className={styles.avatar}/>
            <div className={styles.self_description}>
                <p>桃色豆腐</p>
                <p>momoirodouhu</p>
                <p className={styles.detail}>趣味でちょこっとプログラムを書いてる一般学生<br/>ちなみに桃色要素も豆腐要素も一切ない</p>
            </div>
        </div>
    )
}