import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const GOOGLE_APPLICATION_CREDENTIALS= process.env.GOOGLE_APPLICATION_CREDENTIALS

export default {
    PORT,GOOGLE_APPLICATION_CREDENTIALS
};