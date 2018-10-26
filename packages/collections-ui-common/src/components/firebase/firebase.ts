import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const firebaseApiKey = process.env.REACT_APP_FIREBASE_KEY

const userDbConfig = {
  apiKey: firebaseApiKey,
  authDomain: 'collections-ui-1532736515660.firebaseapp.com',
  databaseURL: 'https://collections-ui-1532736515660.firebaseio.com',
  messagingSenderId: '851210977979',
  projectId: 'collections-ui-1532736515660',
  storageBucket: '',
};

const uuidDbConfig = {
  apiKey: firebaseApiKey,
  authDomain: 'collections-ui-1532736515660.firebaseapp.com',
  databaseURL: 'https://collections-ui-1532736515660-d3c9c.firebaseio.com',
  messagingSenderId: '851210977979',
  projectId: 'collections-ui-1532736515660',
  storageBucket: '',
}

let uuidApp
if (!firebase.apps.length) {
  firebase.initializeApp(userDbConfig)
  uuidApp = firebase.initializeApp(uuidDbConfig, 'uuidDb')
}

const db = firebase.database();
const auth = firebase.auth();
const uuidDb = uuidApp.database()

export {
  auth,
  db,
  uuidDb,
}
