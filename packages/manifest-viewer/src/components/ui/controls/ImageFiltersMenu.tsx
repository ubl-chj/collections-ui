import {Checkbox} from '@material-ui/core'
import Slider from 'rc-slider'
import React from 'react'
import {slide as Menu} from 'react-burger-menu'
import {BRIGHTNESS, Filtering, GREYSCALE, INVERT} from '../../filtering'
import {FiltersIcon} from '../svg'
import menuStylesDark from './styles/menuStylesDark'

export class ImageFiltersMenu extends React.Component<any, any> {
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

  onBrightnessChange = (brightness) => {
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
      <div className='xjKiLc' style={{width: 200}}>
        <div className='Hj59Ib'>Brightness</div>
        <Slider
          aria-label='brightness'
          max={255}
          min={-255}
          onChange={this.onBrightnessChange}
          value={this.state.brightness}
        />
        <div className='Hj59Ib'>Invert</div>
        <Checkbox
          checked={this.state.inverted}
          inputProps={{
            'aria-label': 'primary checkbox',
          }}
          onChange={this.toggleInvert}
          style={{color: "rgba(255, 255, 255, 0.54)"}}
        />
        <div className='Hj59Ib'>Greyscale</div>
        <Checkbox
          checked={this.state.grayscale}
          inputProps={{
            'aria-label': 'primary checkbox',
          }}
          onChange={this.toggleGreyscale}
          style={{color: "rgba(255, 255, 255, 0.54)"}}
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
          customBurgerIcon={false}
          disableCloseOnEsc={Boolean(true)}
          isOpen={this.state.menuOpen}
          noOverlay={true}
          onStateChange={this.handleStateChange}
          right={false}
          styles={menuStylesDark}
          width='275px'
        >
          {this.filters()}
        </Menu>
        <button
          aria-label='toggle image filters'
          className="button-transparent"
          onClick={this.toggleFiltersMenu}
          title='Edit'
          type="button"
        >
          <FiltersIcon />
        </button>
      </div>
    )
  }
}
