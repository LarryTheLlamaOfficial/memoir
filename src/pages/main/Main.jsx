import Footer from "../../components/footer/Footer";
import styles from "./Main.module.css";

function Main() {
    return (
        <div className={styles.main}>
            <div id='contents'></div>
            <Footer />
        </div>
    );
}

export default Main;
