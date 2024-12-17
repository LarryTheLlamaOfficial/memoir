
import Header from "../../components/header/Header.jsx";

import AudioRecorder from "../../components/audiorecorder/AudioRecorder.jsx";

import { auth } from "../../config/firebase.js";

function Record() {
    return (
    <>
        < Header />
        {auth?.currentUser?.uid ? < AudioRecorder /> : <></>}
    </>
    )
    
}

export default Record;