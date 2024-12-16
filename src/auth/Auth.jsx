import { auth, googleProvider } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithRedirect,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    console.log(auth?.currentUser?.email);

    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
        }
    };

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home')
            
        } catch (err) {
            console.error(err);

            switch (err.code) {

                case 'auth/invalid-email':
                    alert('Invalid email.');
                    break;
                case 'auth/user-not-found':
                    alert('No user found.');
                    break;
                case 'auth/wrong-password':
                    alert('Incorrect password.');
                    break;
                default:
                    alert('Login failed. Please try again.');
            }
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
