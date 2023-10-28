import styles from "./header.module.scss"

export default function header() {
    return (
        <div className={styles.header}>
            <a href="/">桃色Archive</a>
            <a href="/categories/">Categories</a>
            <a href="/about">About</a>
        </div>
    );
}