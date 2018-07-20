import {AnnotationsAccessor, ViewerComponent} from "../../core";
import * as React from "react";
import {slide as Menu} from 'react-burger-menu'
import {MetadataItem} from "../ui/osd";
import {Controls} from "../ui";

const uuidv4 = require('uuid/v4');
const manifesto = require('manifesto.js')

export interface MetadataProps {
  key: string,
  bemBlocks?: any
}

export class Metadata extends ViewerComponent<MetadataProps, any> {
  props: any;
  annotationsAccessor: AnnotationsAccessor
  state: { menuOpen: boolean; };

  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false
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
    this.setState(function (prevState) {
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
    let resources = []
    const metadataList = metadata.forEach(function (item) {
      resources.push(item.resource)
    })
    return resources
  }

  render() {
    let document: Object = this.getDocument()
    if (document) {
      const manifest = manifesto.create(document)
      const title = manifesto.TranslationCollection.getValue(manifest.getLabel())
      const items = this.buildMetadata(manifest)
      return (
        <div className="manifest-info">
          <Menu noOverlay right customBurgerIcon={false} isOpen={this.state.menuOpen}
            onStateChange={(state) => this.handleStateChange(state)}>
            <ul className="list-group"> {items.map(({data, label, value}) => <MetadataItem
              key={uuidv4()} data={data} label={label} value={value}/>)}</ul>
          </Menu>
          <div className="btn-group">
            <Controls/>
            <button type="button" className="btn btn-primary-outline btn-xs"
              onClick={this.toggleMenu}><i className="glyphicon glyphicon-info-sign"/></button>
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
