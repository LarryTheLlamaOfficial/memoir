import ResultCard from "../resultcard/ResultCard";
import styles from "./SearchPanel.module.css";

function SearchPanel() {
    return (
        <>
            <div className={[styles.row, styles.content].join(' ')}>
                <ResultCard doc={true}/>
                <ResultCard doc={true}/>
                <ResultCard doc={true}/>
                <ResultCard doc={true}/>

            </div>
        </>
    );
}

export default SearchPanel;