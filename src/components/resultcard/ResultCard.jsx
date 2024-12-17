import styles from "./ResultCard.module.css";

function ResultCard({ doc = null }) {
    return (
        <>
            {doc ? (
                <div className={styles["result-card"]}>
                    <div className={styles["card-content-container"]}>
                        <div className={styles["card-content"]}>
                            <p>Main content</p>
                        </div>
                    </div>
                    <div>
                        Interesting insight
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default ResultCard;
