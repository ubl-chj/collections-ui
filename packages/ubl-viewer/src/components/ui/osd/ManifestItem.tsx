import * as React from 'react';
import OsdComponent from './OsdComponent';

const manifesto = require('manifesto.js')

export const ManifestItem = (props) => {
  const {document, width} = props
  if (document) {
    const manifest = manifesto.create(document)
    const sequences = manifest.getSequences()
    const imageIds = []
    sequences.forEach((seq) => {
      const canvases = seq.getCanvases()
      canvases.forEach((canvas) => {
        const images = canvas.getImages()
        images.forEach((image) => {
          const resource = image.getResource()
          const services = resource.getServices()
          services.forEach((service) => {
            imageIds.push(service.id + '/info.json')
          })
        })
      })
    })
    return (<OsdComponent width={width} images={imageIds}/>)
  }
  return (null)
}
