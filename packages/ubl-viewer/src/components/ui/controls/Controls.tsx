import * as React from "react";
import {slide as Menu} from 'react-burger-menu'
import {withRouter} from 'react-router-dom'
import {ScaleLoader} from "react-spinners";
import {AnnotationsAccessor, ViewerComponent} from "../../../core/index";
import {MetadataSchemaAdapter} from '../../schema'
import {MetadataItem} from "../osd";
import {ArrowLeftIcon} from "./ArrowLeftIcon";
import {ArrowRightIcon} from "./ArrowRightIcon";
import {FullScreenIcon} from "./FullScreenIcon";
import {HomeIcon} from "./HomeIcon";
import {InfoIcon} from "./InfoIcon";
import {RotateLeftIcon} from "./RotateLeftIcon";
import {RotateRightIcon} from "./RotateRightIcon";
import {ZoomInIcon} from "./ZoomInIcon";
import {ZoomOutIcon} from "./ZoomOutIcon";
const tagManager = require('react-gtm-module')
const uuidv4 = require('uuid/v4')
const manifesto = require('manifesto.js')

export interface IMetadataProps {
  key: string,
  bemBlocks?: any
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
    menuOpen: boolean,
    uuid: string,
    loading: boolean,
  }
  props: any
  schema: any

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      menuOpen: false,
      uuid: null,
    }
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state.uuid = uuidv4()
  }

  handleStateChange(state) {
    this.setState({menuOpen: state.menuOpen})
  }

  closeMenu() {
    this.setState({menuOpen: false})
  }

  toggleMenu() {
    this.setState((prevState) => {
      return {menuOpen: !prevState.menuOpen};
    })
  }

  componentDidMount() {
    this.annotationsAccessor = new AnnotationsAccessor()
    this.viewer.addAccessor(this.annotationsAccessor)
  }

  buildMetadata(metadata) {
    const resources = []
    metadata.forEach((item) => {
      resources.push(item.resource)
    })
    return resources
  }

  buildItemList(items) {
    return items.map(({data, label, value}) => <MetadataItem key={uuidv4()} data={data} label={label} value={value}/>)
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
      const thumbnail = manifest.getThumbnail()
      const items = this.buildMetadata(metadata)
      const itemList = this.buildItemList(items)
      const title = manifesto.TranslationCollection.getValue(manifest.getLabel())
      const adapter = new MetadataSchemaAdapter(metadata, Controls.buildContentUrl(), thumbnail, title)
      const schema = adapter.buildStructuredData().dataLayer
      Controls.buildStructuredData(schema)
      return (
        <div className="manifest-info">
          <Menu
            noOverlay={true}
            right={true}
            customBurgerIcon={false}
            isOpen={this.state.menuOpen}
            onStateChange={(state) => this.handleStateChange(state)}
          >
            <ul className="list-group">
              {itemList}
            </ul>
          </Menu>
          <div className="btn-group">
            <ZoomInIcon/>
            <ZoomOutIcon/>
            <HomeIcon/>
            <FullScreenIcon/>
            <ArrowLeftIcon/>
            <ArrowRightIcon/>
            <RotateLeftIcon/>
            <RotateRightIcon/>
            <button type="button" className="btn btn-primary-outline btn-xs" onClick={this.toggleMenu}>
              <InfoIcon/>
            </button>
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
