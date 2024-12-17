import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";

function Header() {
    return (
        <div className={styles.header}>
            <Link
                to='/home'
                className={[styles.logo, styles.link].join(' ')}
            >
                memoir
            </Link>
            <div className={styles["header-right"]}>
                <Link
                    to='/home'
                    className={styles.link}
                >
                    Home
                </Link>
                <Link
                    to='/contact'
                    className={styles.link}
                >
                    Contact
                </Link>
                <Link
                    to='/about'
                    className={styles.link}
                >
                    About
                </Link>
                {auth?.currentUser?.uid ?
                <>
                    <Link
                        to='/record'
                        className={styles.link}
                    >
                        Record
                    </Link>
                    <Link 
                        to='/home'
                        className={styles.link}
                        onClick={
                            async (event) => {
                                try {
                                    await signOut(auth);
                                } catch (err) {
                                    console.error(err);
                                    event.preventDefault()
                                }
                            }
                        }
                    >
                        Logout
                    </Link>
                </>
                :
                    <Link
                        to='/login'
                        className={styles.link}
                    >
                        Login
                    </Link>
                }

            </div>
        </div>
    );
}

export default Header;
