import styles from "./root-index.module.scss"
import global_styles from "@/share/global.module.scss"
import Header from "@/components/Header"
import ProfCard from "@/components/ProfCard"

export default function Home() {
  return (
    <div>
      <Header/>
      <div className={global_styles.main}>
        <div className={global_styles.info}>
          <ProfCard/>
        </div>
      </div>
    </div>
  )
}
