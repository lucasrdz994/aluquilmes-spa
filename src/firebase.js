import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA8RRBZtDGzAXqqFaxtVvAfbZ9HRqFFrmc",
  authDomain: "aluquilmes-60700.firebaseapp.com",
  databaseURL: "https://aluquilmes-60700.firebaseio.com",
  projectId: "aluquilmes-60700",
  storageBucket: "aluquilmes-60700.appspot.com",
  messagingSenderId: "561390600591",
  appId: "1:561390600591:web:2e326694ec3a897c740bfa"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }