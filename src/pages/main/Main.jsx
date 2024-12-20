import Footer from "../../components/footer/Footer";
import styles from "./Main.module.css";
import { useState } from "react";

function Main() {
    const contentPanel = <div className={styles.panel}></div>;

    const recordPanel = null;

    const accountPanel = null;

    var [panel, setPanel] = useState("content");

    const contentSwitch = (name) => {
        switch (name) {
            case "content":
                return contentPanel;
            case "record":
                return recordPanel;
            case "account":
                return accountPanel;
        }
    };

    return (
        <div className={styles.main}>
            <div id='contents'>{contentSwitch(panel)}</div>
            <div className={styles.footer}>
                <Footer />
            </div>
            
        </div>
    );
}

export default Main;
