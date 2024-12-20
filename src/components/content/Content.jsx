import { db } from "../../config/firebase.js";
import Header from "../../components/header/Header.jsx";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { auth } from "../../config/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

function Content() {
    const [transcript, setTranscript] = useState("Loading..."); 
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth state changed:", currentUser);
            setUser(currentUser);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setTranscript("User not authenticated.");
                return;
            }

            try {
                console.log("Fetching data for user:", user.uid);
                
                // Query the transcripts collection and filter by uid
                const transcriptsRef = collection(db, "transcripts");
                const q = query(
                    transcriptsRef,
                    where("uid", "==", user.uid),
                    orderBy("createdAt", "desc")
                );
                
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const latestDoc = querySnapshot.docs[0];
                    setTranscript(latestDoc.data().transcript);
                } else {
                    setTranscript("No transcripts found.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setTranscript("Error fetching data: " + error.message);
            }
        };

        if (!isLoading) {
            fetchData();
        }
    }, [user, isLoading]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return <p>{transcript}</p>;
}

export default Content;