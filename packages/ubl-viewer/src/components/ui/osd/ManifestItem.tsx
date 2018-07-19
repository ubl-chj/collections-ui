import * as React from "react";
import OsdComponent from "./OsdComponent";
const manifesto = require('manifesto.js')

export const ManifestItem = (props) => {
  const {document} = props
    if (document) {
      const manifest = manifesto.create(document)
      const sequences = manifest.getSequences()
      let imageIds = []
      sequences.forEach(function(seq) {
        const canvases = seq.getCanvases()
        canvases.forEach(function(canvas) {
          const images = canvas.getImages()
          images.forEach(function(image) {
            const resource = image.getResource()
            const services = resource.getServices()
            services.forEach(function(service) {
              imageIds.push(service.id + "/info.json")
            })
          })
        })
      })
      return (<OsdComponent images={imageIds}/>)
    }
  return(null)
}
