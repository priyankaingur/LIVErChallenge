import { initializeApp } from "firebase/app";
import firebaseConfig from "./src/config/firebaseConfig";

const app = initializeApp(firebaseConfig);

export default app;
