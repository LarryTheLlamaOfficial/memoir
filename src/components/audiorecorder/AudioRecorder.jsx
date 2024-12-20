import { useState, useRef } from "react";
import axios from 'axios'
import fileDownload from 'js-file-download'
import { auth, storage } from "../../config/firebase";
import { uploadBytes, ref } from "firebase/storage";


// Default file name generator, can be replaced
const defaultGenerateFileName = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().padStart(4, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `memo-${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
};

// Default audioType
const defaultMimeType = "audio/mp3";

// Create audio recorder object
function AudioRecorder({
    onRecordingStop = () => {},
    mimeType = defaultMimeType,
    generateFileName = defaultGenerateFileName
}) {
    // Prepare hooks
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audio, setAudio] = useState(null);
    const [hasAudio, setHasAudio] = useState(false)

    const uploadAudio = async () => {
        const userId = auth?.currentUser?.uid;
        console.log(userId)
        if (userId) {
            const audioFileName = defaultGenerateFileName() + '.mp3';
            const storageRef = ref(storage, `users/${userId}/audio/${audioFileName}`);
            try {
                await uploadBytes(storageRef, audioBlob);
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Cannot upload unless signed in")
        }
    }

    // Get browser microhone permission
    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    // Start the recording
    const startRecording = async () => {
        setHasAudio(false)
        setRecordingStatus("recording");
        // Create new Media recorder instance using the stream and run
        const media = new MediaRecorder(stream, { type: mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();

        // Save audio chunks
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
        setHasAudio(true);
        setRecordingStatus("inactive");
        // Stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            // Creates a blob file from the audiochunks data
            const newAudioBlob = new Blob(audioChunks, { type: mimeType });
            setAudioBlob(newAudioBlob);

            // Creates a playable URL from the blob file.
            const audioUrl = URL.createObjectURL(newAudioBlob);
            setAudio(audioUrl);

            // Give the parent object access to the audio file
            onRecordingStop(audioUrl);

            // Clear audio
            setAudioChunks([]);
        };
    };

    const adaptedRecordText = () => {
        return hasAudio ? 'Re-record' : 'Start Recording'
    }

    return (
        <div>
            <h2>Audio Recorder</h2>
            <main>
                <div className='audio-controls'>
                    {!permission ? (
                        <button
                            onClick={getMicrophonePermission}
                            type='button'
                        >
                            Enable Microphone
                        </button>
                    ) : null}
                    {permission && recordingStatus === "inactive" ? (
                        <button
                            onClick={startRecording}
                            type='button'
                        >
                            {adaptedRecordText()}
                        </button>
                    ) : null}
                    {recordingStatus === "recording" ? (
                        <button
                            onClick={stopRecording}
                            type='button'
                        >
                            Stop Recording
                        </button>
                    ) : null}
                    {hasAudio ? <button onClick={uploadAudio}>
                        Upload
                    </button>
                    : null}
                </div>
            </main>
        </div>
    );
}

export default AudioRecorder;
