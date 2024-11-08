const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, etc.
    auth: {
        user: 'priyankaingur@gmail.com', // Replace with your email
        pass: ''
    }
});

// Cloud Function to trigger on `recentlyViewed` collection changes
exports.monitorProductViews = functions.firestore
    .document('recentlyViewed/{userId}/{viewId}')
    .onCreate(async (snap, context) => {
        const productId = snap.data().productId;
        const timestamp = snap.data().timestamp;

        // Define the timeframe to check (e.g., last 24 hours)
        const timeframe = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

        // Query the `recentlyViewed` collection to count views of the product in the last 24 hours
        const recentViewsQuery = admin.firestore()
            .collectionGroup('recentlyViewed')
            .where('productId', '==', productId)
            .where('timestamp', '>', timeframe);

        const recentViewsSnapshot = await recentViewsQuery.get();

        // If the product has been viewed more than twice in the last 24 hours
        if (recentViewsSnapshot.size > 2) {
            // Send email notification
            sendEmailNotification(productId, recentViewsSnapshot.size);
        }

        return null;
    });

// Function to send email notifications
function sendEmailNotification(productId, viewCount) {
    const mailOptions = {
        from: 'priyankaingur@gmail.com', // sender address
        to: 'priyankaingur@gmail.com', // replace with the recipient's email
        subject: `Product Viewed More Than Twice: ${productId}`,
        text: `The product with ID ${productId} has been viewed ${viewCount} times in the last 24 hours.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
