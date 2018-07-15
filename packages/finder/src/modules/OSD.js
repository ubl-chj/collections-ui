import * as React from "react";
import OpenSeaDragon from 'openseadragon'
import axios from 'axios'
import OsdComponent from "./osd-component"

const defaults = require("lodash/defaults")

export class OSD extends React.Component {
  constructor(props) {
    super(props)
  }

  static defaultConfig () {
    return {

    }
  }

  render() {
    let { id } = this.props
    return (
      <div className="openseadragon" id={id}/>
    )
  }

  initSeaDragon(){
    let self = this
    let { id, image} = this.props
    const tileSource = image + "/info.json";
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
        tileSources: [image + "/info.json"]
      })
    })
  }

  getCoordinates = (image)=>
    axios.get(image + "/info.json").then(function (response) {
      const imageWidth = response.data.width
      const imageHeight = response.data.height
      console.log(imageWidth)
      console.log(imageHeight)
    }).catch(function (error) {
      console.log(error)
    });

  componentDidMount () {
    this.initSeaDragon()
  }

  shouldComponentUpdate(nextProps, nextState){
    return false
  }

  componentWillMount() {
    // sets the initial state
    this.setState({
      isMenuOpened: false
    })
  }
}

export default OSD
