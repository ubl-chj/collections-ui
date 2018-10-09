import * as React from 'react'
import {findDOMNode} from 'react-dom'
import {ViewerComponent, ViewerManager} from '../../../core'
import {ImageFiltersMenu, PageSelector, ViewSelector} from '../controls'
import {FullScreenIcon} from '../svg'

let openSeaDragon

export interface IOsdComponentProps {
  id?: string
  image?: string
  images?: any
  document?: object
  region?: string
  viewer?: ViewerManager
  width: number
}

export class OsdComponent extends ViewerComponent<IOsdComponentProps, any> {

  static generateView(mountNode, config) {
    const newConfig = Object.assign({ bindto: mountNode }, config)
    return openSeaDragon(newConfig)
  }

  state: any
  private osd: any;

  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
      width: props.width,
    }
  }

  defaultOsdProps() {
    const {width} = this.state
    const isMobile = width <= 500
    let showNavigator = true
    let showReferenceStrip = true

    if (isMobile) {
      showNavigator = false
      showReferenceStrip = false
    }
    return {
      constrainDuringPan: false,
      crossOriginPolicy: 'Anonymous',
      defaultZoomLevel: 0,
      fullPageButton: 'full-page',
      homeButton: 'reset',
      id: 'osd',
      maxZoomLevel: 10,
      minZoomLevel: 0,
      nextButton: 'sidebar-next',
      previousButton: 'sidebar-previous',
      referenceStripScroll: 'vertical',
      rotateLeftButton: 'left',
      rotateRightButton: 'right',
      sequenceMode: true,
      showNavigator,
      showReferenceStrip,
      showRotationControl: true,
      tileSources: [this.getImages()],
      visibilityRatio: 0.5,
      zoomInButton: 'zoom-in',
      zoomOutButton: 'zoom-out',
    };
  }

  getImages() {
    return this.props.images
  }

  updateViewer(config) {
    if (!this.osd) {
      this.osd = OsdComponent.generateView(findDOMNode(this), config)
    }
  }

  buildImageFilterMenu() {
    const {menuOpen} = this.state
    if (this.osd) {
      return (
          <ImageFiltersMenu isOpen={menuOpen} osd={this.osd}/>
      )
    }
  }

  buildPageSelector() {
    const imageCount = this.getImages().length
    if (this.osd && imageCount > 1) {
      return (
        <PageSelector imageCount={imageCount} osd={this.osd}/>
      )
    }
  }

  buildViewSelector() {
    const images = this.getImages()
    if (this.osd && images.length > 1) {
      return (<ViewSelector images={images} osd={this.osd}/>)
    }
  }

  componentDidMount() {
    openSeaDragon = require('openseadragon')
    if (this.props.images) {
      this.updateViewer(this.defaultOsdProps())
    }
    this.setState({ menuOpen: false })
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
  }

  shouldComponentUpdate() {
    return true
  }

  render() {
    return (
      <div>
        <div style={{display: 'flex'}}>
          <div className='xjKiLd'>
            {this.buildImageFilterMenu()}
            {this.buildViewSelector()}
            <FullScreenIcon/>
          </div>
          {this.buildPageSelector()}
        </div>
        <div className='openseadragon' id='osd'/>
      </div>
    )
  }
}

export default OsdComponent
