import React, {Component} from 'react'
import OpenSeaDragon from 'openseadragon'
import {
  Controls,
  ViewerProvider,
  ViewerManager,
  Layout,
  TopBar,
  ActionBar,
  LayoutBody
} from 'ubl-viewer'

import axios from 'axios'
import '../index.css'
const manifesto = require('manifesto.js')

let manifest = null
let index = null
let count = null
let image = null
let region = null
let abstractRegion = null
let coordinates = []
let document = null
let viewer;

if (window.location.search && window.location.search.includes("image")) {
  const params = new URLSearchParams(window.location.search)
  image = params.get('image')
  if (params.get('region')) {
    if (!params.get('region').startsWith('pct:')) {
      region = params.get('region').split(',')
    } else {
      abstractRegion = params.get('region').substring(4).split(',')
    }
  }
  const document = image + "/info.json"
  viewer = new ViewerManager(document)
} else if (window.location.search && window.location.search.includes("manifest")
  && window.location.search.includes("index")) {
  const params = new URLSearchParams(window.location.search)
  document = params.get('manifest')
  index = params.get('index')
  count = params.get('count')
  viewer = new ViewerManager(document)
}

const setAbstractRegion = (imageWidth, imageHeight)=> {
  const aspectRatio = imageHeight/imageWidth;
  const x = abstractRegion[0]/100;
  const y = abstractRegion[1]/100 * aspectRatio;
  const w = abstractRegion[2]/100;
  const h = abstractRegion[3]/100 * aspectRatio;
  coordinates.push(x,y,w,h)
  console.log(x,y,w,h)
}

const setRegion = (imageWidth, imageHeight)=> {
  const aspectRatio = imageHeight/imageWidth;
  const x = region[0]/imageWidth;
  const y = region[1]/imageHeight * aspectRatio;
  const w = region[2]/imageWidth;
  const h = region[3]/imageHeight;
  coordinates.push(x,y,w,h)
  console.log(x,y,w,h)
}

class OsdViewer extends Component {
  static defaultConfig () {
    return {
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
      tileSources: [image + "/info.json"],
      overlays: [{
        id: 'overlay-rotation-bounding-box',
        x: coordinates[0],
        y: coordinates[1],
        width: coordinates[2],
        height: coordinates[3],
        rotationMode: OpenSeaDragon.OverlayRotationMode.BOUNDING_BOX
      }]
    }
  }

  render () {
    return (
      <ViewerProvider viewer={viewer}>
      <Layout>
        <TopBar>
          <div className="my-logo-sm">UBL</div>
        </TopBar>
        <ActionBar>
          <Controls index={index} manifest={document} document={viewer.document}/>
        </ActionBar>
        <LayoutBody>
          <div className="openseadragon" id="osd-viewer"/>
        </LayoutBody>
      </Layout>
      </ViewerProvider>
    )
  }

  initSeaDragon(){
    if (image) {
      this.getCoordinates(image).then(data => {
        OpenSeaDragon(OsdViewer.defaultConfig())
      })
    } else if (document) {
        manifesto.loadManifest(document).then(function(manifest) {
          manifest = manifesto.create(manifest);
          const sequence = manifest.getSequenceByIndex(0);
          const canvas = sequence.getCanvasByIndex(parseInt(index) - 1);
          const images = canvas.getImages();
          count = sequence.getCanvases().length
          const annotation = images[0];
          const resource = annotation.getResource();
          const profile = manifesto.ServiceProfile.iiif2ImageLevel1();
          const service = resource.getService(profile);
          image = service.id;
        }).then(image => {
            OpenSeaDragon(OsdViewer.defaultConfig())
          })
    }
  }

  componentDidMount () {
    this.initSeaDragon()
  }

  componentWillMount() {
    // sets the initial state
  }

  getCoordinates = (image)=>
    axios.get(image + "/info.json").then(function (response) {
      const imageWidth = response.data.width
      const imageHeight = response.data.height
      console.log(imageWidth)
      console.log(imageHeight)
      if (region) {
        setRegion(imageWidth, imageHeight)
      } else if (abstractRegion) {
        setAbstractRegion(imageWidth, imageHeight)
      }
    }).catch(function (error) {
      console.log(error)
    });
}


export default OsdViewer
