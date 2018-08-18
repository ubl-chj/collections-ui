import axios from 'axios';
import * as React from 'react';
import {ViewerComponent, ViewerManager} from '../../../core';

const OpenSeaDragon = require('openseadragon');

export interface IOsdComponentProps {
  id?: string;
  image?: string;
  images?: any;
  document?: object;
  region?: string;
  viewer?: ViewerManager;
  defaultProps?: object;
  world?: object;
}

export class OsdComponent extends ViewerComponent<IOsdComponentProps, any> {
  private defaultProps: object;
  private osd: any;

  constructor(props) {
    super(props)
    this.osd = React.createRef();
  }

  render() {
    return (
      <div ref={this.osd} className='openseadragon' id='osd'/>
    )
  }

  defaultOsdProps() {
    return {
      constrainDuringPan: false,
      defaultZoomLevel: 0,
      fullPageButton: 'full-page',
      homeButton: 'reset',
      id: 'osd',
      maxZoomLevel: 10,
      minZoomLevel: 0,
      nextButton: 'sidebar-next',
      previousButton: 'sidebar-previous',
      referenceStripScroll: 'horizontal',
      sequenceMode: true,
      showNavigator: true,
      showReferenceStrip: true,
      tileSources: [this.getImages()],
      visibilityRatio: 0.5,
      zoomInButton: 'zoom-in',
      zoomOutButton: 'zoom-out',
    };
  }

  getImages() {
    return this.props.images
  }

  initSeaDragon() {
    const firstImage = this.props.images[0]
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
    axios.get(image).then((response) => {
      const imageWidth = response.data.width
      const imageHeight = response.data.height
    }).catch((error) => {
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
