import styles from "./Footer.module.css"

function Footer() {
    return (
        <div className={styles.footer}>
            <button>Contents</button>
            <button>Record</button>
            <button>Account</button>
        </div>
    )
}

export default Footer;