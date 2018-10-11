import * as React from 'react'
import {ViewerContext} from "../../../core/react"
import OsdComponent from './OsdComponent'
const manifesto = require('manifesto.js')

export class ManifestItem extends React.Component<any, any> {

  constructor(props) {
    super(props)
  }

  render() {
    const {document, width, canvas} = this.props
    if (document) {
      const manifest = manifesto.create(document)
      const sequences = manifest.getSequences()
      const imageIds = []
      sequences.forEach((seq) => {
        const canvases = seq.getCanvases()
        canvases.forEach((c) => {
          const images = c.getImages()
          images.forEach((image) => {
            const resource = image.getResource()
            const services = resource.getServices()
            services.forEach((service) => {
              imageIds.push(service.id + '/info.json')
            })
          })
        })
      })
      return (
        <ViewerContext.Consumer>
          {(currentCanvas) =>
            <OsdComponent currentCanvas={currentCanvas} width={width} images={imageIds}/>}
         </ViewerContext.Consumer>   )
    }
    return (null)
  }
}
