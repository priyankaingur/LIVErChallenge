# React App with Firebase Authentication

[This](https://liv-er-challenge.vercel.app/) React app allows users to register using email and password through Firebase Authentication.

## Features

- **User Registration**: Users can register with a username and password.
- **Conditional Routing**: Authenticated users are redirected to the main content, while unauthenticated users are prompted to register.

## Technologies

- React
- Firebase Authentication (Email/Password)
- React Router

## Installation

1. Clone the repository:
   ```bash
   git clone the repo
   cd frontend-react-app

2. Install Dependencies
   Install all necessary dependencies using npm:

   `npm install`

3. Set up Firebase
   Go to the Firebase Console, create a new project (or use an existing one).
   Enable Email/Password authentication in Firebase Authentication settings.
   Add your Firebase configuration credentials to the .env file in the root of the project:

   `REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id`

   Make sure you replace the your-* placeholders with your actual Firebase project credentials.

4. Start the App
   Once you've set up the Firebase credentials, start the app:

   `npm start`

This will launch the app in your browser, usually accessible at http://localhost:3000.


