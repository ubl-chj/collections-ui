import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseApi_key = process.env.REACT_APP_FIREBASE_KEY

const config = {
  apiKey: firebaseApi_key,
  authDomain: 'collections-ui-1532736515660.firebaseapp.com',
  databaseURL: 'https://collections-ui-1532736515660.firebaseio.com',
  projectId: 'collections-ui-1532736515660',
  storageBucket: '',
  messagingSenderId: '851210977979'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.database();

export {
  auth,
  db
};
