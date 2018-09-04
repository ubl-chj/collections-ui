import Checkbox from 'rc-checkbox';
import Slider from 'rc-slider';
import * as React from 'react';
import {findDOMNode} from 'react-dom';
import Select from 'react-select'
import {ViewerComponent, ViewerManager} from '../../../core'
import {BRIGHTNESS, Filtering, GREYSCALE, INVERT} from '../../filtering';
import {FiltersIcon} from '../svg';

let openSeaDragon

export interface IOsdComponentProps {
  id?: string;
  image?: string;
  images?: any;
  document?: object;
  region?: string;
  viewer?: ViewerManager;
  defaultProps?: object;
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
  state: any

  private defaultProps: object;
  private osd: any;

  constructor(props) {
    super(props)
    this.state = {
      brightness: 0,
      filtersVisible: false,
      inverted: false,
      selectedOption: null,
    }
  }

  render() {
    if (this.osd) {
      if (this.state.inverted) {
        const filterOptions = {
          filters: [{
            processors: [
              BRIGHTNESS(this.state.brightness),
              INVERT(),
            ],
          }],
          viewer: this.osd,
        }
        const brightness = new Filtering(filterOptions)
      } else {
        const filterOptions = {
          filters: [{
            processors: [
              BRIGHTNESS(this.state.brightness)
            ],
          }],
          viewer: this.osd,
        }
        const brightness = new Filtering(filterOptions)
      }
    }

    if (this.getImages().length > 1) {
      const options = this.selectorOptions()
      return (
        <div>
          <div className='xjKiLc'>
            <button type="button" className="button-transparent" onClick={this.toggleFilters}>
              <FiltersIcon />
            </button>
          </div>
          {this.filters()}
            <div className='selector'>
              <Select
                isSearchable={Boolean(true)}
                defaultValue={options[0]}
                onChange={this.handleChange}
                options={options}
                styles={OsdComponent.customStyles()}
              />
            </div>
          <div className='openseadragon' id='osd'/>
        </div>
      )
    } else {
      return (
        <div>
          <div className='xjKiLc'>
            <button type="button" className="button-transparent" onClick={this.toggleFilters}>
              <FiltersIcon />
            </button>
          </div>
          {this.filters()}
          <div className='openseadragon' id='osd'/>
        </div>
      )
    }
  }

  filters() {
    if (this.state.filtersVisible) {
      return (
        <div style={{width: 200}} className='xjKiLc'>
          <Slider min={-255} max={255} value={this.state.brightness} onChange={this.onSliderChange}/>
          <Checkbox onChange={this.toggleInvert}/>
        </div>
      )
    } else {
      return null
    }
  }

  onSliderChange = (brightness) => {
    this.setState({
      brightness,
    });
  }

  toggleInvert = () => {
    this.setState((state) => ({
      inverted: !state.inverted,
    }));
  }

  toggleFilters = () => {
    this.setState((state) => ({
      filtersVisible: !state.filtersVisible,
    }));
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
      crossOriginPolicy: 'Anonymous',
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
    return true
  }
}

export default OsdComponent
