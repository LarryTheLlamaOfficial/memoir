# memoir

*memoir* is a work in progress voice-recording app that automatically generates transcripts and summaries of your recordings so you can easily find them later.

## Tech Stack

The project uses React for the front end and firebase to manage the backend services.

## Current State

Currently the front end is almost empty. Most of the sections are just to test out components and to try out the backend.
At the moment, the current functionality is the following:
- Sign in with google or email.
- Record a memo in the record tab, and upload it (uploaded to firebase storage)
- Recording passes through a third party speech to text api using Deepgram and firebase functions and is converted into a firestore transcript entry.
- Transcript triggers a firebase function to create a summary using gpt-4o-mini (the dot point summary is implemented too but has been disabled).
- Currently results are only visible from the backend, but here is an example of what the result looks like:
![image](https://github.com/user-attachments/assets/fcb9b4d4-48e0-4075-ba21-051f7d96bcf4)

- The backend is currently whitelisted while it is in development. 

## Todo

- Add visibility of memos and paginate.
- Fix sign in redirect.
- Design front end and build the design.
- Convert to a mobile app using capacitor (do not plan to release as a full app, only as an sdk install with a whitelisted backend to save costs).
