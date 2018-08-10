import * as React from "react";
import {ViewerComponent, ViewerManager} from "../../../core"
import axios from 'axios'

const OpenSeaDragon = require('openseadragon')

export interface OsdComponentProps {
  id?: string,
  image?: string,
  images?: Array<string>
  document?: Object
  region?: string
  viewer?: ViewerManager
  defaultProps?: Object
  world?: Object
}

export class OsdComponent extends ViewerComponent<OsdComponentProps, any> {
  defaultProps: Object
  osd: any

  constructor(props) {
    super(props)
    this.osd = React.createRef();
  }

  render() {
    return (
      <div ref={this.osd} className="openseadragon" id="osd"/>
    )
  }

  defaultOsdProps() {
    return {
      sequenceMode: true,
      showReferenceStrip: true,
      referenceStripScroll: 'horizontal',
      showNavigator: true,
      id: 'osd',
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
      tileSources: [this.getImages()]
    };
  }

  getImages() {
    return this.props.images
  }

  initSeaDragon() {
     let firstImage = this.props.images[0]
    this.getCoordinates(firstImage).then(() => {
      this.viewer = OpenSeaDragon(this.defaultOsdProps())
    })
  }

  componentDidMount() {
    if (this.props.images) {
      this.initSeaDragon()
    }
   }

  shouldComponentUpdate() {
    return false
  }

  getCoordinates = (image) =>
    axios.get(image).then(function (response) {
      const imageWidth = response.data.width
      const imageHeight = response.data.height
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
