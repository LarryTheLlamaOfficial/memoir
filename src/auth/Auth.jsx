import { auth, googleProvider } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithRedirect,
} from "firebase/auth";
import { useState } from "react";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(auth?.currentUser?.email);

    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
            alert("Failed to create user");
        }
    };

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
            alert("Login Failed");
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithRedirect(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
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
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Auth;
