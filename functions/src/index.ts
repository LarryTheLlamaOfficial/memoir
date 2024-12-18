/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import * as functions from "firebase-functions";
//import axios from "axios";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const createTranscript = functions.storage.onObjectFinalized({
    secrets: ["DEEPGRAM_KEY"]
},
    async (object) => {
        const fileBucket = object.data.bucket; // Storage bucket containing the file.
        const filePath = object.data.name; // File path in the bucket.
        const contentType = object.data.contentType;

        if (fileBucket != 'memoir-1296.firebasestorage.app') {
            logger.log("Accessing from wrong bucket")
            return;
        }

        if (contentType != "audio/mpeg") {
            logger.log("Not an audio file")
            return;
        }
        
        const split = filePath.split("/")

        if (split.length != 4) {
            logger.log("Must be length 4");
            return;
        }

        if (split[0] == "users" && split[2] == "audio") {
            const uid = split[1];
            const rawFileName = split[4];
            console.log(uid + rawFileName); // To remove unused errors
        } else {

        }
    }
);
