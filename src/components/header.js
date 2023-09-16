import styles from "./header.module.scss"

export default function header() {
    return (
        <div className={styles.header}>
            <a>桃色Archive</a>
            <a>Categories</a>
            <a>About</a>
        </div>
    );
}