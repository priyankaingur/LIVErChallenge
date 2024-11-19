import * as functions from 'firebase-functions/v1';
import app from "./app.js";
import admin from 'firebase-admin';
import nodemailer from "nodemailer";


import http from "http";
import {createClient} from "redis";

const server = http.createServer(app);

//Utilize for local development and comment it for deploying into firebase
server.listen(3000, () => {
    console.log(`Server running on port 3000`);
});

export {app,createClient}


// Initialize Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    }
});

export const watchRecentlyViewed = functions.firestore
    .document('users/{userId}/recentlyViewed/{viewId}')
    .onCreate(async (snapshot, context) => {
        const { userId } = context.params;
        const viewedData = snapshot.data();
        const { productId, timestamp } = viewedData;

        // Define timeframe (1 hour in milliseconds)
        const timeframe = 60 * 60 * 1000;
        const currentTime = Date.now();
        const startTime = currentTime - timeframe;

        try {
            // Query the same product within the timeframe
            const viewSnapshot = await admin.firestore()
                .collection(`users/${userId}/recentlyViewed`)
                .where('productId', '==', productId)
                .where('timestamp', '>=', startTime)
                .get();

            // Check if the product was viewed more than twice within the timeframe
            if (viewSnapshot.size > 2) {
                // Prepare email notification details
                const mailOptions = {
                    from: process.env.EMAIL_USERNAME,
                    to: 'priyankaingur@gmail.com',
                    subject: `Product ${productId} Viewed Frequently`,
                    text: `The product with ID ${productId} has been viewed ${viewSnapshot.size} times within the last hour.`,
                };

                // Send the email
                await transporter.sendMail(mailOptions);
                console.log(`Email sent for product ID ${productId}`);
            }
        } catch (error) {
            console.error("Error sending email notification:", error);
        }
    });

// Export the app for Firebase Cloud Functions
export const api = functions.https.onRequest(app);

