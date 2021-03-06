import React from 'react'
import {HeadProvider, Meta, Title} from 'react-head'
import {ScaleLoader} from 'react-spinners'
import {AnnotationsAccessor, ViewerComponent} from '../../../core'
import {HeadMeta, MetadataSchemaAdapter, buildContentUrl, buildStructuredData, buildThumbnail} from '../../schema'
import {ButtonBar} from './ButtonBar'
import {ManifestInfoMenu} from './ManifestInfoMenu'
const manifesto = require('manifesto-fork')

export interface IMetadataProps {
  key: any;
  bemBlocks?: any;
  location: any;
  uuid: any;
  isMobile: boolean;
}

export class Controls extends ViewerComponent<IMetadataProps, any> {
  annotationsAccessor: AnnotationsAccessor
  document: any
  key: any
  state: {
    locationState: any;
    uuid: string;
    loading: boolean;
    isMobile: boolean;
  }
  schema: any

  constructor(props) {
    super(props)
    this.state = {
      isMobile: props.isMobile,
      loading: true,
      locationState: props.location.state,
      uuid: null,
    }
  }

  componentDidMount() {
    this.annotationsAccessor = new AnnotationsAccessor()
    if (this.viewer) {
      this.viewer.addAccessor(this.annotationsAccessor)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isMobile !== prevProps.isMobile) {
      this.setState({isMobile: this.props.isMobile})
    }
  }

  getThumbnail() {
    if (this.props.location.state) {
      return this.props.location.state.result._source.thumbnail
    }
  }

  buildButtonBar() {
    const {locationState, isMobile} = this.state
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
            <h2 className="window-manifest-title" title={title}>{title}</h2>
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
