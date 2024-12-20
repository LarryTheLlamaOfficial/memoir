import { auth, googleProvider } from "../../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    console.log(auth?.currentUser?.email);
    console.log(auth.currentUser, auth);

    const testUserSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, "testing@gmail.com", "123456");
            navigate("/home");
        } catch (err) {
            console.error(err);
            alert("Failed to sign in as test user.");
        }
    };
    

    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/home");
        } catch (err) {
            console.error(err);
            alert("Failed to create user");
        }
    };

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            navigate("/home");
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
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider).then(
                () => {navigate("/home");}
            );
            
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth).then(
                () => {navigate("/home");}
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            { auth?.currentUser?.uid ? 
                <button onClick={logout}>Logout</button>
                :
                <div>
                    <input
                    placeholder='Email...'
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        placeholder='Password...'
                        onChange={(e) => setPassword(e.target.value)}
                        type='password'
                    />
                    <button onClick={signIn}>Sign In</button>
                    <button onClick={signUp}>Sign Up</button>
                    <button onClick={signInWithGoogle}>Sign In With Google</button>
                    <button onClick={testUserSignIn}>Test User Sign In</button>
                </div>
            }
        </>
    );
}

export default Auth;
