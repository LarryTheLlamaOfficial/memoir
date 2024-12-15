import { Link } from "react-router-dom";
import Header from "../../components/header/Header.jsx";

function Home() {
    return (
        <>
            <Header></Header>
            <Link to="/login">Sign In Page</Link>
        </>
    )
}

export default Home;