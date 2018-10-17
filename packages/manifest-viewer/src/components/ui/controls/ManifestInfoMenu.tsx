import * as React from "react"
import {slide as Menu} from 'react-burger-menu'
import {MetadataItem} from "../osd"
import {InfoIcon} from "../svg"

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
      const link = '<img crossorigin alt="logo" src=' + value + '>'
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

  static menuStyles() {
    return {
      bmBurgerBars: {
        background: 'white',
        height: '10%',
      },
      bmBurgerButton: {
        height: '18px',
        left: '24px',
        position: 'fixed',
        top: '24px',
        width: '24px',
      },
      bmCross: {
        background: '#000',
      },
      bmCrossButton: {
        height: '24px',
        right: '15px',
        top: '5px',
        width: '24px',
      },
      bmItem: {
        display: 'inline-block',
      },
      bmItemList: {
        color: '#000',
        padding: '0.8em',
      },
      bmMenu: {
        backgroundColor: '#efefef',
        borderRight: '1px solid lightgray',
        bottom: '30px',
        boxSizing: 'border-box',
        height: '90%',
        left: '0',
        opacity: '1',
        padding: '2px',
        position: 'absolute',
        top: '33px',
        transform: 'translateX(0)',
        width: '100%',
        wordWrap: 'break-word',
      },
      bmMorphShape: {
        fill: '#373a47',
      },
    }
  }

  state: {
    menuOpen: boolean,
    uuid: string,
    width: number,
  }

  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
      uuid: null,
      width: props.width,
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
          width='380px'
          styles={ManifestInfoMenu.menuStyles()}
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
          className="btn btn-primary-outline btn-xs"
          onClick={this.toggleMenu}
        >
          <InfoIcon/>
        </button>
      </div>
    )
  }
}
