// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAI, getGenerativeModel, getLiveGenerativeModel, GoogleAIBackend, ResponseModality } from "firebase/ai";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: "ai-ppt-gen-645d7.firebaseapp.com",

  projectId: "ai-ppt-gen-645d7",

  storageBucket: "ai-ppt-gen-645d7.firebasestorage.app",

  messagingSenderId: "586456230428",

  appId: "1:586456230428:web:da67b710a2d5dd36d54dd9",
  measurementId: "G-XCKFDL2FZD"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseDb=getFirestore(app);

// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
export const GeminiAiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

export const GeminiAiLiveModel = getLiveGenerativeModel(ai, {
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseModalities: [ResponseModality.TEXT],
  },
});