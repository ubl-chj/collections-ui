import * as React from 'react'
import {ViewerContext} from "../../../core/react"
const manifesto = require('manifesto-fork')
import {OsdComponent} from './OsdComponent'

export class ManifestItem extends React.Component<any, any> {
  state: {
    OsdComponent: React.ComponentType<any>,
  }

  constructor(props) {
    super(props)
    this.state = {
      OsdComponent: null,
    }
  }

  render() {
    const {document, width} = this.props
    if (document) {
      const manifest = manifesto.create(document)
      const sequences = manifest.getSequences()
      const imageIds = []
      const canvasLabels = []
      sequences.forEach((seq) => {
        const canvases = seq.getCanvases()
        canvases.forEach((c) => {
          const cLabel = manifesto.LanguageMap.getValue(c.getLabel())
          canvasLabels.push(cLabel)
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
            <OsdComponent currentCanvas={currentCanvas} canvasLabels={canvasLabels} width={width} images={imageIds}/>}
         </ViewerContext.Consumer>   )
    }
    return (null)
  }
}
