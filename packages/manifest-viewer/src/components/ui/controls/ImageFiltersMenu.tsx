import Checkbox from 'rc-checkbox'
import Slider from 'rc-slider'
import * as React from "react"
import {slide as Menu} from 'react-burger-menu'
import {BRIGHTNESS, Filtering, GREYSCALE, INVERT} from "../../filtering"
import {FiltersIcon} from "../svg"

export class ImageFiltersMenu extends React.Component<any, any> {

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
        top: '65px',
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

  constructor(props) {
    super(props)
    this.state = {
      brightness: 0,
      greyscale: false,
      inverted: false,
      menuOpen: props.isOpen,
      osd: props.osd,
    }
  }

  handleStateChange = (state) => {
    this.setState({menuOpen: state.menuOpen})
  }

  toggleFiltersMenu = () => {
    this.setState((prevState) => {
      return {menuOpen: !prevState.menuOpen};
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

  filters() {
    return (
      <div style={{width: 200}} className='xjKiLc'>
        <div className='Hj59Ib'>Brightness</div>
        <Slider
          aria-label='brightness'
          min={-255}
          max={255}
          value={this.state.brightness}
          onChange={this.onSliderChange}
        />
        <div className='Hj59Ib'>Invert</div>
        <Checkbox
          aria-label='invert'
          onChange={this.toggleInvert}
        />
        <div className='Hj59Ib'>Greyscale</div>
        <Checkbox
          aria-label='grayscale'
          onChange={this.toggleGreyscale}
        />
      </div>
    )
  }

  buildFilters() {
    if (this.state.osd) {
      if (this.state.inverted) {
        const filterOptions = {
          filters: [{
            processors: [
              BRIGHTNESS(this.state.brightness),
              INVERT(),
            ],
          }],
          viewer: this.state.osd,
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
          viewer: this.state.osd,
        }
        const filters = new Filtering(filterOptions)
      } else {
        const filterOptions = {
          filters: [{
            processors: [
              BRIGHTNESS(this.state.brightness),
            ],
          }],
          viewer: this.state.osd,
        }
        const filters = new Filtering(filterOptions)
      }
    }
  }

  componentDidMount() {
    this.buildFilters()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.osd !== prevProps.osd) {
      this.setState({osd: this.props.osd})
    }
    if (this.props.isOpen !== prevProps.isOpen) {
      this.setState({menuOpen: this.props.isOpen})
    }
    if (this.state.brightness !== prevState.brightness) {
      this.buildFilters()
    }
    if (this.state.inverted !== prevState.inverted) {
      this.buildFilters()
    }
    if (this.state.greyscale !== prevState.greyscale) {
      this.buildFilters()
    }
  }

  render() {
    return (
      <div>
        <Menu
          width='275px'
          styles={ImageFiltersMenu.menuStyles()}
          noOverlay={true}
          right={false}
          customBurgerIcon={false}
          isOpen={this.state.menuOpen}
          onStateChange={this.handleStateChange}
        >
        {this.filters()}
        </Menu>
        <button
          aria-label='toggle image filters'
          title='Edit'
          type="button"
          className="button-transparent"
          onClick={this.toggleFiltersMenu}
        >
          <FiltersIcon />
        </button>
      </div>
      )
  }
}
