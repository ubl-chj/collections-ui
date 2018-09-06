import Checkbox from 'rc-checkbox';
import Slider from 'rc-slider';
import * as React from 'react';
import {slide as Menu} from 'react-burger-menu'
import {findDOMNode} from 'react-dom';
import Select from 'react-select'
import {ViewerComponent, ViewerManager} from '../../../core'
import {BRIGHTNESS, Filtering, GREYSCALE, INVERT} from '../../filtering';
import {FiltersIcon, ScrollIcon} from '../svg';

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

  static selectorStyles() {
    return {
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? 'black' : 'white',
        borderBottom: '1px dotted silver',
        color: state.isSelected ? 'white' : 'black',
      }),
    }
  }

  static menuStyles() {
    return {
      bmBurgerBars: {
        background: 'white',
        height: '10%',
      },
      bmBurgerButton: {
        height: '18px',
        left: '24px',
        position: 'fixed',
        top: '24px',
        width: '24px',
      },
      bmCross: {
        background: '#d8d8d8',
      },
      bmCrossButton: {
        height: '24px',
        right: '7px',
        top: '45px',
        width: '24px',
      },
      bmItem: {
        display: 'inline-block',
      },
      bmItemList: {
        color: '#000',
        padding: '0.8em',
      },
      bmMenu: {
        backgroundColor: '#242424',
        bottom: '30px',
        boxSizing: 'border-box',
        height: '90%',
        opacity: '1',
        padding: '24px',
        position: 'relative',
        top: '45px',
        transform: 'translateX(0)',
        width: '100%',
        wordWrap: 'break-word',
      },
      bmMorphShape: {
        fill: '#373a47',
      },
    }
  }
  state: any

  private defaultProps: object;
  private osd: any;

  constructor(props) {
    super(props)
    this.state = {
      brightness: 0,
      greyscale: false,
      inverted: false,
      menuOpen: false,
      scrollView: false,
      selectedOption: null,
    }
  }

  filters() {
      return (
        <div style={{width: 200}} className='xjKiLc'>
          <div className='Hj59Ib'>Brightness</div>
          <Slider min={-255} max={255} value={this.state.brightness} onChange={this.onSliderChange}/>
          <div className='Hj59Ib'>Invert</div>
          <Checkbox onChange={this.toggleInvert}/>
          <div className='Hj59Ib'>Greyscale</div>
          <Checkbox onChange={this.toggleGreyscale}/>
        </div>
      )
  }

  handleStateChange = (state) => {
    this.setState({menuOpen: state.menuOpen})
  }

  handlePaging = (selectedOption) => {
    this.setState({ selectedOption });
    if (this.osd) {
      this.osd.goToPage(selectedOption.value)
    }
  }

  toggleFiltersMenu = () => {
    this.setState((prevState) => {
      return {menuOpen: !prevState.menuOpen};
    })
  }

  toggleScrollView = () => {
    this.setState((prevState) => {
      return {scrollView: !prevState.scrollView};
    })
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

  toggleGreyscale = () => {
    this.setState((state) => ({
      greyscale: !state.greyscale,
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

  updateViewer(config) {
    if (!this.osd) {
      this.osd = OsdComponent.generateView(findDOMNode(this), config);
    }
  }

  buildScrollView() {
    if (this.osd) {
      if (this.state.scrollView) {
        this.osd.world.removeItem(this.osd.world.getItemAt(0))
        this.getImages().forEach((i, index) => {
          this.osd.addTiledImage({
            tileSource: i,
            success(event) {
              const tiledImage = event.item
              tiledImage.setPosition({
                x: index * 1.05,
                y: 0,
              })
            },
          })
        })
      } else {
        let pageNumber
        if (this.state.selectedOption) {
          pageNumber = this.state.selectedOption.value
        } else {
          pageNumber = 0
        }
        this.osd.goToPage(pageNumber)
      }
    }
  }

  buildFilters() {
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
        const filters = new Filtering(filterOptions)
      } else if (this.state.greyscale) {
        const filterOptions = {
          filters: [{
            processors: [
              BRIGHTNESS(this.state.brightness),
              GREYSCALE(),
            ],
          }],
          viewer: this.osd,
        }
        const filters = new Filtering(filterOptions)
      } else {
        const filterOptions = {
          filters: [{
            processors: [
              BRIGHTNESS(this.state.brightness),
            ],
          }],
          viewer: this.osd,
        }
        const filters = new Filtering(filterOptions)
      }
    }
  }

  buildSelector() {
    const options = this.selectorOptions()
    if (this.getImages().length > 1) {
      return (
        <div className='selector'>
          <Select
            isSearchable={Boolean(true)}
            defaultValue={options[0]}
            onChange={this.handlePaging}
            options={options}
            styles={OsdComponent.selectorStyles()}
          />
        </div>)
    } else {
      return null
    }
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

  render() {
    this.buildFilters()
    this.buildScrollView()

    return (
      <div>
        <Menu
          width='275px'
          styles={OsdComponent.menuStyles()}
          noOverlay={true}
          right={false}
          customBurgerIcon={false}
          isOpen={this.state.menuOpen}
          onStateChange={(state) => this.handleStateChange(state)}
        >
         {this.filters()}
        </Menu>
        <div style={{display: 'flex'}}>
          <div className='xjKiLd'>
            <button type="button" className="button-transparent" onClick={this.toggleFiltersMenu}>
              <FiltersIcon />
            </button>
            <button type="button" className="button-transparent" onClick={this.toggleScrollView}>
              <ScrollIcon/>
            </button>
          </div>
          {this.buildSelector()}
        </div>
        <div className='openseadragon' id='osd'/>
      </div>
    )
  }
}

export default OsdComponent
