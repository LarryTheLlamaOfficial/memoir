import Header from "../../components/header/Header";
import styles from "./NoPage.module.css";

function NoPage() {
    return (
        <>
            <Header />
            <div className={styles['center-container']}>
                <span className={styles['error-message']}>Page not found :(</span>
            </div>
        </>
    );
}

export default NoPage;
