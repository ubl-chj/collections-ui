var firebase = require('firebase')

const firebaseApiKey = process.env.REACT_APP_FIREBASE_KEY

const config = {
  apiKey: firebaseApiKey,
  authDomain: 'collections-ui-1532736515660.firebaseapp.com',
  databaseURL: 'https://collections-ui-1532736515660-d3c9c.firebaseio.com',
  messagingSenderId: '851210977979',
  projectId: 'collections-ui-1532736515660',
  storageBucket: '',
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const db = firebase.database()

getManifestUUID = (manifest) => {
  const ref = db.ref('manifestMap')
  ref.once('value')
    .then((snapshot) => {
      snapshot.forEach((c) => {
        const val = c.val()
        if (val.manifest === manifest) {
          console.log(c.key)
        }
      })
    })
}

getManifestForUUID = (uuid) => {
  db.ref('/manifestMap/' + uuid).once('value')
    .then((snapshot) => {
      return snapshot.val().manifest
    })
}

getManifestUUID('https://iiif.harvardartmuseums.org/manifests/object/296562')
getManifestForUUID('ff04c090-9d77-55eb-a567-bfa646b11ebf')

