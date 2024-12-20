
import Header from "../../components/header/Header.jsx";
import SearchPanel from "../../components/searchpanel/SearchPanel.jsx";
import { auth } from "../../config/firebase.js";

function Home() {
    console.log(auth)
    return (
        <>
            <Header />
            <SearchPanel />
        </>
    );
}

export default Home;
