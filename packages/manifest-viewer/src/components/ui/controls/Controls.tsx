import * as React from "react"
import {HeadProvider, Meta, Title} from 'react-head'
import {ScaleLoader} from "react-spinners"
import {AnnotationsAccessor, ViewerComponent} from "../../../core"
import {buildContentUrl, buildStructuredData, buildThumbnail, HeadMeta, MetadataSchemaAdapter} from '../../schema'
import {ButtonBar} from "./ButtonBar"
import {ManifestInfoMenu} from "./ManifestInfoMenu"
const manifesto = require('manifesto-fork')

export interface IMetadataProps {
  key: any,
  bemBlocks?: any
  location: any
  uuid: any
  width: number
}

export class Controls extends ViewerComponent<IMetadataProps, any> {

  annotationsAccessor: AnnotationsAccessor
  document: any
  key: any
  state: {
    locationState: any,
    uuid: string,
    loading: boolean,
    width: number,
  }
  schema: any

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      locationState: props.location.state,
      uuid: null,
      width: props.width,
    }
  }

  componentDidMount() {
    this.annotationsAccessor = new AnnotationsAccessor()
    if (this.viewer) {
      this.viewer.addAccessor(this.annotationsAccessor)
    }
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

  buildButtonBar() {
    const {locationState, width} = this.state
    const isMobile = width <= 500
    if (isMobile) {
      return null
    } else {
      return (
        <ButtonBar className='btn-group' locationState={locationState}/>
      )
    }
  }

  render() {
    const document = this.getDocument()
    if (document) {
      const manifest = document
      const metadata = manifest.getMetadata()
      const attributionText = manifesto.LanguageMap.getValue(manifest.getRequiredStatement().value)
      const title = manifesto.LanguageMap.getValue(manifest.getLabel())
      const thumbnail = buildThumbnail(manifest)
      const href = buildContentUrl()
      const adapter = new MetadataSchemaAdapter(metadata, href, thumbnail, title)
      const schema = adapter.buildStructuredData().dataLayer
      buildStructuredData(schema)
      return (
        <div className="manifest-info">
          <HeadMeta
            href={href}
            schema={schema}
            thumbnail={thumbnail}
            title={title}
          />
          <ManifestInfoMenu
            attributionText={attributionText}
            manifest={manifest}
            metadata={metadata}
          />
          {this.buildButtonBar()}
          <div className="window-manifest-title">
            <h2 title={title} className="window-manifest-title">{title}</h2>
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
