import * as React from "react";
const OpenSeaDragon = require('openseadragon')
import {ViewerComponent} from "../../../core"
import axios from 'axios'
import {ViewerManager} from "../../../core";

const defaults = require("lodash/defaults")

export interface OsdComponentProps {
  id?: string,
  image?: string,
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

  getImagesFromDocument() {
    let {document} = this.props
    const images = []

  }

  initSeaDragon() {
    let self = this
    let image = "https://iiif.ub.uni-leipzig.de/iiif/j2k/0000/0081/0000008110/00000006.jpx"
    this.getCoordinates(image).then(() => {
      self.viewer = OpenSeaDragon({
        sequenceMode: false,
        showReferenceStrip: false,
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
        tileSources: ["https://iiif.ub.uni-leipzig.de/iiif/j2k/0000/0081/0000008110/00000006.jpx/info.json"]
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
    this.initSeaDragon()
  }

  getCoordinates = (image) =>
    axios.get(image + "/info.json").then(function (response) {
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
