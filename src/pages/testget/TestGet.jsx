import { db } from "../../config/firebase.js";
import Header from "../../components/header/Header.jsx";
import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import Content from "../../components/content/Content.jsx";
import { auth } from "../../config/firebase.js";


function TestGet() {

    return (
        <>
            <Header />
            <Content />
        </>
    );
}

export default TestGet;
