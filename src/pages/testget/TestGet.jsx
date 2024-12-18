import { db } from "../../config/firebase.js";
import Header from "../../components/header/Header.jsx";
import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";

function TestGet() {
    const [text, setText] = useState("Loading..."); // Initial state

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "testing", "xzwtgl40YhlTMtLu6ION");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setText(docSnap.data().text); // Update the state with the fetched data
            } else {
                setText("No such document!");
            }
        };

        fetchData(); // Call the asynchronous function inside useEffect
    }, []); // Empty dependency array ensures this runs only once on component mount

    return (
        <>
            <Header />
            <p>{text}</p> {/* Render the text from state */}
        </>
    );
}

export default TestGet;
