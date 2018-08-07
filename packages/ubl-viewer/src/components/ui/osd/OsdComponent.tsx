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
  world?: Object
}

export class OsdRef extends React.Component {
  constructor(props) {
    super(props)
  }

  getWorld() {
    return this;
  }

  render() {
    return(<div/>)
  }

  componentDidMount() {
    console.log(this.getWorld())
  }
}

export class OsdComponent extends ViewerComponent<OsdComponentProps, any> {
  defaultProps: Object
  world: any
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
    if (this.osd.current.world) {
      console.log(this.osd.current.world.getHomeBounds())
    }
   }

  shouldComponentUpdate() {
    return false
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
