import * as React from "react"
import {push as Menu} from 'react-burger-menu'
import {ContentTreeIcon} from "../svg"
import {ContentTree} from './ContentTree'

export class ContentTreeMenu extends React.Component<any, any> {

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
        background: '#666',
      },
      bmCrossButton: {
        height: '24px',
        right: '20px',
        top: '59px',
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
        backgroundColor: '#efefef',
        bottom: '30px',
        boxSizing: 'border-box',
        height: '90%',
        opacity: '1',
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
      menuOpen: props.isOpen,
      osd: props.osd,
    }
  }

  handleStateChange = (state) => {
    this.setState({menuOpen: state.menuOpen})
  }

  toggleContentTreeMenu = () => {
    this.setState((prevState) => {
      return {menuOpen: !prevState.menuOpen};
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.osd !== prevProps.osd) {
      this.setState({osd: this.props.osd})
    }
    if (this.props.isOpen !== prevProps.isOpen) {
      this.setState({menuOpen: this.props.isOpen})
    }
  }

  render() {
    return (
      <div>
        <Menu
          width='275px'
          styles={ContentTreeMenu.menuStyles()}
          noOverlay={true}
          right={false}
          customBurgerIcon={false}
          isOpen={this.state.menuOpen}
          onStateChange={this.handleStateChange}
        >
          <ContentTree
            menuOpen={this.state.menuOpen}
            osd={this.state.osd}
          />
        </Menu>
        <button
          aria-label='toggle Content Tree'
          title='Content Tree'
          type="button"
          className="button-transparent"
          onClick={this.toggleContentTreeMenu}
        >
          <ContentTreeIcon />
        </button>
      </div>
    )
  }
}
