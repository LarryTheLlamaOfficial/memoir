import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AudioRecorder from "./components/audiorecorder/AudioRecorder";

function App() {
    return (
        <div>
            <h1>React Media Recorder</h1>
            <div>
                <AudioRecorder />
            </div>
        </div>
    );
}
export default App;
