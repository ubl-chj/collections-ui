import * as React from "react"
import {push as Menu} from 'react-burger-menu'
import {MetadataItem} from "../osd"
import {InfoIcon} from "../svg"
import infoMenuStyle from './styles/infoMenuStyle'

const uuidv4 = require('uuid/v4')

export class ManifestInfoMenu extends React.Component<any, any> {

  static buildAttribution(value) {
    return(
      <li className='list-group-item'><div className='metadata-label'>Attribution:</div>
        <div dangerouslySetInnerHTML={{__html: value}}/>
      </li>)
  }

  static buildLogo(value) {
    if (value) {
      const link = '<img alt="logo" src=' + value + '>'
      return (
        <li className='list-group-item'>
          <div className='metadata-label'>Logo:</div>
          <div dangerouslySetInnerHTML={{__html: link}}/>
        </li>)
    }
  }

  static buildManifestLink(value) {
    const link =  '<a href=' + value + '>' + value + '</a>'
    return(
      <li className='list-group-item'><div className='metadata-label'>Manifest:</div>
        <div dangerouslySetInnerHTML={{__html: link}}/>
      </li>)
  }

  state: {
    menuOpen: boolean,
    uuid: string,
  }

  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
      uuid: null,
    }
    this.state.uuid = uuidv4()
  }

  handleStateChange = (state) => {
    this.setState({menuOpen: state.menuOpen})
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

  toggleMenu = () => {
    this.setState((prevState) => {
      return {menuOpen: !prevState.menuOpen};
    })
  }

  render() {
    const {attributionText, manifest, metadata} = this.props
    const manifestItem = ManifestInfoMenu.buildManifestLink(manifest.id)

    const logo = manifest.getLogo()
    const logoItem = ManifestInfoMenu.buildLogo(logo)

    const attribution = ManifestInfoMenu.buildAttribution(attributionText)

    const items = this.buildMetadata(metadata)
    const itemList = this.buildItemList(items)

    return(
      <div className="btn-group">
        <Menu
          disableCloseOnEsc={Boolean(true)}
          width='380px'
          styles={infoMenuStyle}
          noOverlay={true}
          right={true}
          customBurgerIcon={false}
          isOpen={this.state.menuOpen}
          onStateChange={this.handleStateChange}
        >
          <ul className="list-group">
            {itemList}
            {manifestItem}
            {attribution}
            {logoItem}
          </ul>
        </Menu>
        <button
          aria-label='toggle manifest information'
          title='Info'
          type="button"
          className="btn-viewer btn-xs"
          onClick={this.toggleMenu}
        >
          <InfoIcon/>
        </button>
      </div>
    )
  }
}
