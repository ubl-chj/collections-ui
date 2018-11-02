var firebase = require('firebase')
var admin = require('firebase-admin')
var serviceAccount = require('/home/christopher/collections-ui-88993f241585.json')
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
      console.log(snapshot.val().manifest)
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
getManifestForUUID('f15f9d56-5c7d-5583-9530-296cd6914ed3')


//const manifestIds = require('/tmp/mdz-uuids3.json')

//pushManifestUUID(manifestIds)
