import axios from 'axios';

import { config } from 'dotenv';

config();
const firebaseApiKey = process.env.FB_API_KEY;

const retrieveToken = async (email, password) =>{
        try {
            const response = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
                {
                    email,
                    password,
                    returnSecureToken: true, // To get the idToken
                }
            );

            // Return idToken and refreshToken from the response
            return {
                idToken: response.data.idToken,
                userId: response.data.localId,
                refreshToken: response.data.refreshToken,
            };
        } catch (error) {
            throw new Error('Failed to authenticate user');
        }
    }

export {retrieveToken};
