import * as React from "react";
import {slide as Menu} from 'react-burger-menu'
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
import {StructuredDataImageObject} from "../../../../../finder/src/components/schema/StructuredDataImageObject";
const uuidv4 = require('uuid/v4');
const manifesto = require('manifesto.js')

export interface IMetadataProps {
  key: string,
  bemBlocks?: any
}

export class ButtonBar extends ViewerComponent<IMetadataProps, any> {
  props: any;
  annotationsAccessor: AnnotationsAccessor
  state: { menuOpen: boolean; };
  document: any
  manifest: any
  items: any
  title: any
  itemList: any
  schema: any

  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
    }
    this.toggleMenu = this.toggleMenu.bind(this);
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
    this.document = this.getDocument()
    this.manifest = manifesto.create(this.document)
    const metadata = this.manifest.getMetadata()
    this.items = this.buildMetadata(metadata)
    this.itemList = this.buildItemList()
    this.title = manifesto.TranslationCollection.getValue(this.manifest.getLabel())
    const adapter = new MetadataSchemaAdapter(metadata, null, null, null)
    this.schema = adapter.buildStructuredData().dataLayer
  }

  buildMetadata(metadata) {
    const resources = []
    metadata.forEach((item) => {
      resources.push(item.resource)
    })
    return resources
  }

  buildItemList() {
    if (this.items) {
      return this.items.map(({data, label, value}) => <MetadataItem key={uuidv4()} data={data} label={label} value={value}/>)
    } else {
      return (null)
    }
  }

  getTitle() {
    if (this.document) {
      return(
      <div className="window-manifest-title">
        <h2 className="window-manifest-title">{this.title}</h2>
      </div>)
    }
  }

  render() {
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
              {this.itemList}
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
          {this.getTitle()}
          <StructuredDataImageObject schema={this.schema}/>
        </div>
      )
    }
  }
