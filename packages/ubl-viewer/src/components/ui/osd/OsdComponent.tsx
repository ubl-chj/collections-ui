import * as React from 'react';
import {findDOMNode} from 'react-dom';
import Select from 'react-select'
import {ViewerComponent, ViewerManager} from '../../../core'
let openSeaDragon

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

  static generateView(mountNode, config) {
    const newConfig = Object.assign({ bindto: mountNode }, config)
    return openSeaDragon(newConfig)
  }

  static customStyles() {
    return {
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? 'black' : 'white',
        borderBottom: '1px dotted silver',
        color: state.isSelected ? 'white' : 'black',
      }),
    }
  }

  private defaultProps: object;
  private osd: any;

  constructor(props) {
    super(props)
    this.state = {
      selectedOption: null,
    }
  }

  render() {
    if (this.getImages().length > 1) {
      const options = this.selectorOptions()
      return (
        <div className='selector'>
          <Select isSearchable={Boolean(true)} defaultValue={options[0]} onChange={this.handleChange} options={options}
            styles={OsdComponent.customStyles()}/>
          <div className='openseadragon' id='osd'/>
        </div>
      )
    } else {
      return (
          <div className='openseadragon' id='osd'/>
      )
    }
  }

  // TODO get Canvas labels
  selectorOptions() {
    const pages = this.getImages().length
    const options = []
    for (let i = 0; i < pages; i++) {
      const option = {
        label: i, value: i,
      }
      options.push(option)
    }
    return options
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
      referenceStripScroll: 'vertical',
      rotateLeftButton: 'left',
      rotateRightButton: 'right',
      sequenceMode: true,
      showNavigator: true,
      showReferenceStrip: true,
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

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    if (this.osd) {
      this.osd.goToPage(selectedOption.value)
    }
  }

  updateViewer(config) {
    if (!this.osd) {
      this.osd = OsdComponent.generateView(findDOMNode(this), config);
    }
    this.osd.addHandler("page", (data) => {
      console.log(data.page)
    })
    const viewport = this.osd.viewport
    this.osd.addHandler('canvas-click', (event) => {
      const webPoint = event.position;
      const viewportPoint = viewport.pointFromPixel(webPoint)
      const imagePoint = viewport.viewportToImageCoordinates(viewportPoint)
      console.log(webPoint.toString(), viewportPoint.toString(), imagePoint.toString())
    })
  }

  componentDidMount() {
    openSeaDragon = require('openseadragon')
    if (this.props.images) {
      this.updateViewer(this.defaultOsdProps())
    }
  }

  shouldComponentUpdate() {
    return false
  }
}

export default OsdComponent
