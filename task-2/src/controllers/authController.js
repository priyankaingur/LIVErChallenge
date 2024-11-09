import {retrieveToken} from "../services/authService.js";

const signIn = async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        try {
            const { idToken, userId, refreshToken } = await retrieveToken(email, password);

            res.status(200).json({ idToken, userId,refreshToken });
        } catch (error) {
            next(error);
        }
    }

export {signIn}
