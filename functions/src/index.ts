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
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import axios from "axios";

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "memoir-1296.firebasestorage.app",
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/*
export const createTranscript = functions.storage.onObjectFinalized(
    {
        secrets: ["DEEPGRAM_KEY"],
    },
    async (object) => {
        const fileBucket = object.data.bucket; // Storage bucket containing the file.
        const filePath = object.data.name; // File path in the bucket.
        const contentType = object.data.contentType;

        if (fileBucket != "memoir-1296.firebasestorage.app") {
            logger.log("Accessing from wrong bucket");
            return;
        }

        if (contentType != "audio/mpeg") {
            logger.log("Not an audio file");
            return;
        }

        const split = filePath.split("/");

        if (split.length != 4) {
            logger.log("Must be length 4");
            return;
        }

        if (split[0] == "users" && split[2] == "audio") {
            const uid = split[1];
            const rawFileName = split[4];
            functions.logger.log(
                `Processing audio file for user: ${uid}, file: ${rawFileName}`
            );

            const deepgramKey = process.env.DEEPGRAM_KEY;

            if (!deepgramKey) {
                functions.logger.error("Deepgram key is missing!");
                return;
            }

            const file = admin.storage().bucket(fileBucket).file(filePath);
            const [url] = await file.getSignedUrl({
                action: "read",
                expires: Date.now() + 60 * 60 * 1000,
            });

            functions.logger.log(`Generated signed URL for file: ${url}`);

            const deepgram = createClient(deepgramKey);

            try {
                const { result, error } =
                    await deepgram.listen.prerecorded.transcribeUrl(
                        {
                            url: url,
                        },
                        {
                            model: "nova-2",
                            smart_format: true,
                        }
                    );

                if (error) {
                    functions.logger.error(
                        "Error with Deepgram transcription",
                        error
                    );
                    return;
                }
                const transcript =
                    result.results.channels[0]?.alternatives[0]?.transcript;
                if (transcript) {
                    functions.logger.log(`Transcript: ${transcript}`);

                    // Optionally save the transcript to Firestore
                    await admin.firestore().collection("transcripts").add({
                        uid: uid,
                        audioFile: filePath,
                        transcript: transcript,
                        summary_generated: false,
                        summary: "",
                        dotpoint_generated: false,
                        dotpoint: "",
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    });

                    functions.logger.log("Transcript saved to Firestore");
                } else {
                    functions.logger.log("No transcript found in the result");
                }
            } catch (error) {
                functions.logger.error("Error calling Deepgram API", error);
            }
        } else {
            functions.logger.log("Path does not match the expected pattern");
        }
    }
);
*/

export const createTranscript = functions.storage.onObjectFinalized(
    {
        secrets: ["DEEPGRAM_KEY"],
    },
    async (object) => {
        const fileBucket = object.data.bucket; // Storage bucket containing the file.
        const filePath = object.data.name; // File path in the bucket.
        const contentType = object.data.contentType;

        logger.log(fileBucket);
        logger.log(filePath);
        logger.log(contentType);

        if (fileBucket != "memoir-1296.firebasestorage.app") {
            logger.log("Accessing from wrong bucket");
            return;
        }

        if (contentType != "audio/mp3") {
            logger.log("Not an audio file. Actual type");
            return;
        }

        const split = filePath.split("/");

        if (split.length != 4) {
            logger.log("Must be length 4");
            return;
        }

        if (split[0] == "users" && split[2] == "audio") {
            const uid = split[1];
            const rawFileName = split[3];
            functions.logger.log(
                `Processing audio file for user: ${uid}, file: ${rawFileName}`
            );

            const deepgramKey = process.env.DEEPGRAM_KEY;

            if (!deepgramKey) {
                functions.logger.error("Deepgram key is missing!");
                return;
            }

            const file = admin.storage().bucket(fileBucket).file(filePath);
            var [url] = "";
            try {
                [url] = await file.getSignedUrl({
                    action: "read",
                    expires: Date.now() + 60 * 60 * 1000, // 1 hour expiration
                });
                logger.log(`Generated signed URL for file: ${url}`);
            } catch (error) {
                logger.error("Error generating signed URL", error);
                return;
            }

            try {
                // Perform the API request to Deepgram
                const response = await axios.post(
                    "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
                    { url: url },
                    {
                        headers: {
                            Authorization: `Token ${deepgramKey}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const { result, error } = response.data;
                if (error) {
                    functions.logger.error(
                        "Error with Deepgram transcription",
                        error
                    );
                    return;
                }

                const transcript =
                    result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
                logger.log(result);

                if (transcript) {
                    functions.logger.log(`Transcript: ${transcript}`);

                    // Optionally save the transcript to Firestore
                    await admin.firestore().collection("transcripts").add({
                        uid: uid,
                        audioFile: filePath,
                        transcript: transcript,
                        summary_generated: false,
                        summary: "",
                        dotpoint_generated: false,
                        dotpoint: "",
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    });

                    functions.logger.log("Transcript saved to Firestore");
                } else {
                    functions.logger.log("No transcript found in the result");
                }
            } catch (error) {
                functions.logger.error("Error calling Deepgram API", error);
            }
        } else {
            functions.logger.log("Path does not match the expected pattern");
        }
    }
);
