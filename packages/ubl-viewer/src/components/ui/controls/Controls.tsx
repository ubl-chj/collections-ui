import * as React from "react";
import {withRouter} from 'react-router-dom'
import {ScaleLoader} from "react-spinners"
import {AnnotationsAccessor, ViewerComponent} from "../../../core/index"
import {MetadataSchemaAdapter} from '../../schema'
import {ArrowLeftIcon, ArrowRightIcon, FullScreenIcon, HomeIcon, RotateLeftIcon, RotateRightIcon, ZoomInIcon,
  ZoomOutIcon} from "../svg"
import {ManifestInfoMenu} from "./ManifestInfoMenu";
const tagManager = require('react-gtm-module')
const manifesto = require('manifesto.js')

export interface IMetadataProps {
  key: string,
  bemBlocks?: any
  location: any
  width: number
}

export class Controls extends ViewerComponent<IMetadataProps, any> {

  static buildContentUrl() {
    return window.location.href
  }

  static buildStructuredData(schema) {
    const dataLayer = {
      dataLayer: schema,
      dataLayerName: 'schemaDataLayer',
    }
    tagManager.dataLayer(dataLayer)
  }

  annotationsAccessor: AnnotationsAccessor
  state: {
    uuid: string,
    loading: boolean,
    width: number,
  }
  schema: any

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      uuid: null,
      width: props.width,
    }
  }

  componentDidMount() {
    this.annotationsAccessor = new AnnotationsAccessor()
    this.viewer.addAccessor(this.annotationsAccessor)
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
  }

  getThumbnail() {
    if (this.props.location.state) {
      return this.props.location.state.result._source.thumbnail
    }
  }

  render() {
    const document = this.getDocument()
    if (document) {
      const manifest = manifesto.create(document)
      const metadata = manifest.getMetadata()
      const attributionText = manifesto.TranslationCollection.getValue(manifest.getAttribution())
      const title = manifesto.TranslationCollection.getValue(manifest.getLabel())
      let thumbnail = manifest.getThumbnail()
      if (thumbnail) {
        thumbnail = thumbnail.id
      } else {
        thumbnail = null
      }
      const adapter = new MetadataSchemaAdapter(metadata, Controls.buildContentUrl(), thumbnail, title)
      const schema = adapter.buildStructuredData().dataLayer
      Controls.buildStructuredData(schema)
      return (
        <div className="manifest-info">
          <ManifestInfoMenu
            attributionText={attributionText}
            manifest={manifest}
            metadata={metadata}
          />
          <div className="btn-group">
            <ZoomInIcon/>
            <ZoomOutIcon/>
            <HomeIcon/>
            <FullScreenIcon/>
            <ArrowLeftIcon/>
            <ArrowRightIcon/>
            <RotateLeftIcon/>
            <RotateRightIcon/>
          </div>
          <div className="window-manifest-title">
            <h2 className="window-manifest-title">{title}</h2>
          </div>
        </div>
      )
    }
    return (
      <div className='centered'>
        <ScaleLoader color='#FFF' loading={this.state.loading}/>
    </div>)
  }
}
