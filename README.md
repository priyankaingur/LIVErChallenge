# LIVErChallenge

# Recently Viewed Products API

Backend API for managing recently viewed products for authenticated users.

## Features

- **User Authentication** via Firebase (email/password).
- **Logging Recently Viewed Products**: Stores and caches products that users have viewed.
- **Secure**: JWT authentication for protected routes.

## Technologies

- **Node.js & Express**
- **Firebase Authentication & Firestore**
- **Redis** for caching recently viewed products.

## Setup

### 1. Clone the repo
git clone repo
cd task-2

2. Install dependencies

   `npm install`

3. Set up environment variables
   Create a .env file with your Firebase and Redis credentials:

    `FB_API_KEY=your-firebase-api-key
    RD_HOST=localhost
    RD_PORT=6379`

4. Start the server

  ` npm start`

#### API Docs

Access the API documentation via Swagger:

[Swagger API Docs](https://api-gteteofhta-uc.a.run.app/api-docs/)

How to use the Swagger UI:

1. First, Register using the frontend app hosted [here](https://api-gteteofhta-uc.a.run.app/)
2. This will allow you to create a new user with a username and password.
3. Get the Token: After registering via the frontend, use the Auth API in 
   Swagger (/login) to authenticate and get the userId and token. 
4. Set the Token in Swagger: In Swagger UI, click on the Authorize button 
   and enter the token as Bearer <token>. 
5. Use the userId as a parameter for the /recently-viewed API to fetch recently viewed products. 
6. Use the API:
    - POST **api/v1/users/:userId/recentlyViewed:** 
      - Log a product view for the authenticated user. 
      - This endpoint requires the Authorization header with the token.
      - A list of product IDs to be used: [KXc7IkBEtQcVlScbdmLO, Ykglf5AazcQGwGnQIdkM, aEAPH3a4piehMK2IsNlD, t6jEOk1xHsiwYlCPPgN9].
    - GET **api/v1/users/:userId/recentlyViewed:** 
      - Fetch recently viewed products for the authenticated user. Pass the userId as a parameter. 
      - Check Recently Viewed Products on the Frontend 

Access the list of products the user has viewed via the frontend app, 
available at: [[url](https://api-gteteofhta-uc.a.run.app/recently-viewed)]


