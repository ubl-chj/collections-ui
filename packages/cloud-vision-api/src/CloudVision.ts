const cloudVision = require('@google-cloud/vision');

const options = {
  keyFilename: process.env.REACT_APP_VISION_SERVICE_KEY_PATH,
  projectId: 'collections-ui-1532736515660',
}

const client = new cloudVision.ImageAnnotatorClient(options);

export class CloudVision {

  imageURI: string

  constructor(imageURI: string) {
    this.imageURI = imageURI
  }

  detectLabels() {
    return client.labelDetection(this.imageURI)
      .then((results) => {
        return results[0].labelAnnotations
      })
      .catch((err) => {
        console.error('ERROR:', err);
      })
  }
}
