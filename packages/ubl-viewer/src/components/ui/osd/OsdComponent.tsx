import * as React from "react";
import {ViewerComponent, ViewerManager} from "../../../core"
import axios from 'axios'

const OpenSeaDragon = require('openseadragon')

const defaults = require("lodash/defaults")

export interface OsdComponentProps {
  id?: string,
  image?: string,
  images?: Array<string>
  document?: Object
  region?: string
  viewer?: ViewerManager
  defaultProps?: Object
}

export class OsdComponent extends ViewerComponent<OsdComponentProps, any> {
  defaultProps: Object
  osd: Object

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="openseadragon" id="osd-viewer"/>
    )
  }

  initSeaDragon() {
    let self = this
    let firstImage = this.props.images[0]
    this.getCoordinates(firstImage).then(() => {
      self.viewer = OpenSeaDragon({
        sequenceMode: true,
        showReferenceStrip: true,
        referenceStripScroll: 'vertical',
        showNavigator: true,
        id: 'osd-viewer',
        visibilityRatio: 0.5,
        constrainDuringPan: false,
        defaultZoomLevel: 0,
        minZoomLevel: 0,
        maxZoomLevel: 10,
        zoomInButton: 'zoom-in',
        zoomOutButton: 'zoom-out',
        homeButton: 'reset',
        fullPageButton: 'full-page',
        previousButton: 'sidebar-previous',
        nextButton: 'sidebar-next',
        tileSources: [this.props.images]
      })
    })
  }

  componentDidMount() {

  }

  shouldComponentUpdate() {
    return false
  }

  componentWillMount() {
    super.componentWillMount()
    if (this.props.images) {
      console.log(this.props.images)
      this.initSeaDragon()
    }
  }

  getCoordinates = (image) =>
    axios.get(image).then(function (response) {
      const imageWidth = response.data.width
      const imageHeight = response.data.height
      console.log(imageWidth)
      console.log(imageHeight)
    }).catch(function (error) {
      console.log(error)
    });

  setAbstractRegion = (imageWidth, imageHeight) => {
    const aspectRatio = imageHeight / imageWidth;
  }

  setRegion = (imageWidth, imageHeight) => {
    const aspectRatio = imageHeight / imageWidth;
  }
}

export default OsdComponent
