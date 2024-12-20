import { auth, googleProvider } from "../../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    onAuthStateChanged
} from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Monitor auth state changes
    useEffect(() => {
        const returnHome = onAuthStateChanged(auth, (user) => {
            setIsLoading(false);
            if (user) {
                navigate("/home", { replace: true });
            }
        });

        return () => returnHome();
    }, [navigate]);

    const testUserSignIn = async () => {
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, "testing@gmail.com", "123456");
        } catch (err) {
            console.error(err);
            alert("Failed to sign in as test user.");
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async () => {
        try {
            setIsLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
            alert("Failed to create user");
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async () => {
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
            switch (err.code) {
                case "auth/invalid-email":
                    alert("Invalid email.");
                    break;
                case "auth/user-not-found":
                    alert("No user found.");
                    break;
                case "auth/wrong-password":
                    alert("Incorrect password.");
                    break;
                default:
                    alert("Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
            alert("Google sign-in failed");
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await signOut(auth);
            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
            alert("Logout failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {auth?.currentUser?.uid ? (
                <button onClick={logout} disabled={isLoading}>
                    Logout
                </button>
            ) : (
                <div>
                    <input
                        placeholder="Email..."
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    <input
                        placeholder="Password..."
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        disabled={isLoading}
                    />
                    <button onClick={signIn} disabled={isLoading}>
                        Sign In
                    </button>
                    <button onClick={signUp} disabled={isLoading}>
                        Sign Up
                    </button>
                    <button onClick={signInWithGoogle} disabled={isLoading}>
                        Sign In With Google
                    </button>
                    <button onClick={testUserSignIn} disabled={isLoading}>
                        Test User Sign In
                    </button>
                </div>
            )}
        </>
    );
}

export default Auth;