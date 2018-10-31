var firebase = require('firebase')
var admin = require('firebase-admin')
var serviceAccount = require('/home/christopher/collections-ui-54c7a8766a8d.json')
const firebaseApiKey = process.env.REACT_APP_FIREBASE_KEY

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://collections-ui-1532736515660-e42a7.firebaseio.com'
})

const db = admin.database()

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

pushManifestUUID = (manifest) => {
  const ref = db.ref('manifestMap')
  ref.update(manifest, function(error) {
    if (error) {
      console.log('Data could not be saved.' + error);
    } else {
      console.log('Data saved successfully.');
    }
  })
}

// getManifestUUID('https://iiif.harvardartmuseums.org/manifests/object/296562')
//console.log(getManifestForUUID('48c4c023-7501-5438-9e42-cd76305a8997'))

const manifestIds = require('/home/christopher/Downloads/export5.json')

pushManifestUUID(manifestIds)
