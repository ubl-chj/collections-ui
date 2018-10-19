import * as React from 'react'
import {findDOMNode} from 'react-dom'
import {ViewerManager} from '../../../core'
import {ImageFiltersMenu, PageSelector, ViewSelector} from '../controls'
import {BackArrow, FullScreenIcon} from '../svg'

let openSeaDragon

export interface IOsdComponentProps {
  id?: string
  currentCanvas?: number
  images?: any
  document?: object
  region?: string
  viewer?: ViewerManager
  width: number
  canvasLabels: any
}

export class OsdComponent extends React.Component<IOsdComponentProps, any> {

  static generateView(mountNode, config) {
    const newConfig = Object.assign({ bindto: mountNode }, config)
    return openSeaDragon(newConfig)
  }

  state: any
  private osd: any;

  constructor(props) {
    super(props)
    this.state = {
      currentCanvas: props.currentCanvas,
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
    const ajaxHeaders = {
       // "x-requested-with": "XMLHttpRequest",
    }

    return {
      ajaxHeaders,
      constrainDuringPan: false,
      crossOriginPolicy: 'Anonymous',
      defaultZoomLevel: 0,
      fullPageButton: 'full-page',
      homeButton: 'reset',
      id: 'osd',
      loadTilesWithAjax: true,
      maxZoomLevel: 10,
      minZoomLevel: 0,
      navigatorPosition: "BOTTOM_RIGHT",
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
    }
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
    const canvasLabels = this.props.canvasLabels
    const {currentCanvas} = this.state
    if (this.osd && imageCount > 1) {
      return (<PageSelector currentCanvas={currentCanvas} canvasLabels={canvasLabels} imageCount={imageCount} osd={this.osd}/>)
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
            <BackArrow/>
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
