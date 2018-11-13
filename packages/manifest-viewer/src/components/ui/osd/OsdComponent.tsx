import {AuthUserContext} from "collections-ui-common";
import * as React from 'react'
import {ViewerManager} from '../../../core'
import {ContentTreeMenu, ImageFiltersMenu, PageSelector, ViewSelector, VisionMenu} from '../controls'
import {PagingControls} from '../controls/PagingControls'
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

  static generateView(config) {
    return openSeaDragon(config)
  }

  static controlBarStyles() {
    return {
      backgroundColor: 'black',
      width: '50px',
      zindex: 1000,
    }
  }

  state: any
  element: any = null
  private osd: any

  constructor(props) {
    super(props)
    this.state = {
      contentMenuOpen: false,
      currentCanvas: props.currentCanvas,
      currentResourceURI: null,
      filterMenuOpen: false,
      pagingControlsVisible: true,
      visionMenuOpen: false,
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
      element: this.element,
      fullPageButton: 'full-page',
      homeButton: 'reset',
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

  setRef = (el: any) => (this.element = el)

  updateViewer(config) {
    if (!this.osd) {
      this.osd = OsdComponent.generateView(config)
    }
  }

  setCurrentResourceURI() {
    if (!this.state.currentCanvas) {
      this.setState({currentResourceURI: this.props.images[0]})
    } else if (this.state.currentCanvas) {
      this.setState({currentResourceURI: this.props.images[this.state.currentCanvas]})
    }
    this.osd.addHandler("page", (data) => {
      if (this.state.currentCanvas !== data.page) {
        this.setState({currentResourceURI: this.props.images[data.page]})
      }
    })
  }

  buildImageFilterMenu() {
    const {filterMenuOpen} = this.state
    if (this.osd) {
      return (
          <ImageFiltersMenu
            isOpen={filterMenuOpen}
            osd={this.osd}
          />
      )
    }
  }

  buildVisionMenu() {
    const {currentResourceURI, visionMenuOpen} = this.state
    if (this.osd) {
      return (
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
            <VisionMenu
              currentResourceURI={currentResourceURI}
              isOpen={visionMenuOpen}
              osd={this.osd}
            /> : null
          }
        </AuthUserContext.Consumer>
      )
    }
  }

  buildContentTreeMenu() {
    const {contentMenuOpen} = this.state
    if (this.osd) {
      return (
        <ContentTreeMenu
          isOpen={contentMenuOpen}
          osd={this.osd}
        />
      )
    }
  }

  buildPageSelector() {
    const imageCount = this.getImages().length
    const canvasLabels = this.props.canvasLabels
    const {currentCanvas, width} = this.state
    const isMobile = width <= 500
    if (!isMobile) {
      if (this.osd && imageCount > 1) {
        return (
          <PageSelector
            currentCanvas={currentCanvas}
            canvasLabels={canvasLabels}
            imageCount={imageCount}
            osd={this.osd}
          />)
      }
    }
  }

  buildPagingControls() {
    const {pagingControlsVisible, width} = this.state
    if (pagingControlsVisible) {
      const isMobile = width <= 500
      if (isMobile) {
        return <PagingControls osd={this.osd}/>
      } else {
        return <PagingControls osd={this.osd}/>
      }
    }
  }

  buildViewSelector() {
    const images = this.getImages()
    if (this.osd && images.length > 1) {
      return (
        <ViewSelector
          images={images}
          osd={this.osd}
        />)
    }
  }

  componentDidMount() {
    openSeaDragon = require('openseadragon')
    if (this.props.images) {
      this.updateViewer(this.defaultOsdProps())
    }
    this.setState({ menuOpen: false })
    this.setCurrentResourceURI()
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
    if (this.props.currentCanvas !== prevProps.currentCanvas) {
      this.setState({currentCanvas: this.props.currentCanvas})
    }
  }

  render() {
    return (
      <main>
        <div style={{display: 'flex'}}>
          <div style={OsdComponent.controlBarStyles()}>
            <div style={{display: 'flex', flexFlow: 'row', height: '40px'}}>
              <BackArrow/>
              {this.buildPageSelector()}
            </div>
            {this.buildImageFilterMenu()}
            {this.buildViewSelector()}
            {this.buildContentTreeMenu()}
            {this.buildVisionMenu()}
            <FullScreenIcon/>
          </div>
          {this.buildPagingControls()}
        </div>
        <div className='openseadragon' ref={this.setRef}/>
      </main>
    )
  }
}
