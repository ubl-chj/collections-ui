import * as React from "react";
import {slide as Menu} from 'react-burger-menu'
import {AnnotationsAccessor, ViewerComponent} from "../../../core/index";
import {MetadataItem} from "../osd";

const uuidv4 = require('uuid/v4');
const manifesto = require('manifesto.js')

export interface IMetadataProps {
  key: string,
  bemBlocks?: any
}

export class Metadata extends ViewerComponent<IMetadataProps, any> {
  props: any;
  annotationsAccessor: AnnotationsAccessor
  state: { menuOpen: boolean; };

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

  componentWillMount() {
    super.componentWillMount()
    this.annotationsAccessor = new AnnotationsAccessor()
    this.viewer.addAccessor(this.annotationsAccessor)
  }

  buildMetadata(manifest) {
    const metadata = manifest.getMetadata()
    const resources = []
    metadata.forEach((item) => {
      resources.push(item.resource)
    })
    return resources
  }

  render() {
    const document: object = this.getDocument()
    if (document) {
      const manifest = manifesto.create(document)
      const title = manifesto.TranslationCollection.getValue(manifest.getLabel())
      const items = this.buildMetadata(manifest)
      return (
        <div className="manifest-info">
          <Menu
            noOverlay
            right
            customBurgerIcon={false}
            isOpen={this.state.menuOpen}
            onStateChange={(state) => this.handleStateChange(state)}
          >
            <ul className="list-group">
              {items.map(({data, label, value}) => <MetadataItem key={uuidv4()} data={data} label={label} value={value}/>)}
            </ul>
          </Menu>
          <div className="btn-group">
            <button type="button" className="btn btn-primary-outline btn-xs">
              <a id="zoom-in"><i className="glyphicon glyphicon-zoom-in"/></a>
            </button>
            <button type="button" className="btn btn-primary-outline btn-xs">
              <a id="zoom-out"><i className="glyphicon glyphicon-zoom-out"/></a>
            </button>
            <button type="button" className="btn btn-primary-outline btn-xs">
              <a id="reset"><i className="glyphicon glyphicon-home"/></a>
            </button>
            <button type="button" className="btn btn-primary-outline btn-xs">
              <a id="full-page"><i className="glyphicon glyphicon-resize-full"/></a>
            </button>
            <button type="button" className="btn btn-primary-outline btn-xs">
              <a id="sidebar-previous"><i className="glyphicon glyphicon-chevron-left"/></a>
            </button>
            <button type="button" className="btn btn-primary-outline btn-xs">
              <a id="sidebar-next"><i className="glyphicon glyphicon-chevron-right"/></a>
            </button>
            <button type="button" className="btn btn-primary-outline btn-xs" onClick={this.toggleMenu}>
              <i className="glyphicon glyphicon-info-sign"/>
            </button>
          </div>
          <div className="window-manifest-title">
            <h2 className="window-manifest-title">{title}</h2>
          </div>
        </div>
      )
    }
    return (null)
  }
}
