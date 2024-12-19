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

                logger.log(response);

                const result = response.data;
                if (!result) {
                    functions.logger.error("Error with Deepgram transcription");
                    return;
                }

                const transcript =
                    result?.results?.channels?.[0]?.alternatives?.[0]
                        ?.transcript;
                logger.log(result);

                if (transcript) {
                    functions.logger.log(`Transcript: ${transcript}`);

                    // Optionally save the transcript to Firestore
                    await admin.firestore().collection("transcripts").add({
                        uid: uid,
                        //audioFile: filePath,
                        transcript: transcript,
                        summary_generated: false,
                        summary: "",
                        dotpoint_generated: true,
                        dotpoint: "",
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    });

                    functions.logger.log("Transcript saved to Firestore");

                    try {
                        await admin
                            .storage()
                            .bucket(fileBucket)
                            .file(filePath)
                            .delete();
                        logger.log("Deleted audio file successfully");
                    } catch (error) {
                        logger.error("Failed to delete audio file", error);
                    }
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

export const makeSummary = functions.firestore.onDocumentCreated(
    {
        document: "transcripts/{docId}",
        secrets: ["OPENAI_KEY"],
    },
    async (event) => {
        const snapshot = event.data;
        if (!snapshot) {
            logger.log("Empty transcript");
            return;
        }

        const data = snapshot.data();
        const transcript = data.transcript;
        const openaiKey = process.env.OPENAI_KEY;

        const updateData: Record<string, any> = {};

        if (data.summary_generated) {
            logger.log("Summary already generated");
        } else {
            // Perform the API request to Deepgram
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content:
                                "Summarize the given audio transcript of an idea into one sentence. There may be typos in the transcript. Focus on specific details to distinguish it from potentially similar ideas. Start directly with the main idea, avoiding phrases like 'The idea is that' or 'The idea proposes that'.",
                        },
                        { role: "user", content: transcript },
                    ],
                    temperature: 0.2,
                    max_tokens: 500,
                },
                {
                    headers: {
                        Authorization: `Bearer ${openaiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = response.data;

            const summary = result?.choices?.[0]?.message.content;
            if (summary) {
                updateData["summary"] = summary;
                updateData["summary_generated"] = true;
            } else {
                logger.log("Error with summary API call");
            }
        }

        if (data.dotpoint_generated) {
            logger.log("Dotpoint already generated");
        } else {
            // Perform the API request to Deepgram
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "Create 3 dot points of the following:",
                        },
                        { role: "user", content: transcript },
                    ],
                    temperature: 0.2,
                    max_tokens: 100,
                },
                {
                    headers: {
                        Authorization: `Bearer ${openaiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = response.data;

            const dotpoint = result?.choices?.[0]?.message.content;
            if (dotpoint) {
                updateData["dotpoint"] = dotpoint;
                updateData["dotpoint_generated"] = true;
            } else {
                logger.log("Error with summary API call");
            }
        }

        if (Object.keys(updateData).length > 0) {
            await snapshot.ref.update(updateData);
            logger.log("Updated document with summary and/or dotpoint fields");
        }
    }
);
