import { Link } from "react-router-dom";
import Header from "../../components/header/Header.jsx";

import { db } from "../../config/firebase";
import { getDocs, getDoc, collection } from "firebase/firestore";

import { useEffect, useState, useMemo } from "react";

import AudioRecorder from "../../components/audiorecorder/AudioRecorder.jsx";

function Home() {
    const [testList, setTestList] = useState([]);

    const testCollectionRef = useMemo(() => collection(db, "testing"), [db]);

    useEffect(() => {
        const getTestList = async () => {
            try {
                const data = await getDocs(testCollectionRef);
                console.log(data.docs[0].data);
            } catch (err) {
                console.error(err);
            }
        };

        getTestList();
    }, []);

    return (
        <>
            <Header />
            <AudioRecorder/>
        </>
    );
}

export default Home;
