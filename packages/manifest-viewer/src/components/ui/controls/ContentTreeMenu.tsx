import React from 'react'
import {push as Menu} from 'react-burger-menu'
import {ContentTreeIcon} from '../svg'
import {ContentTree} from './ContentTree'
import contentTreeMenuStyle from './styles/contentTreeMenuStyle'

export class ContentTreeMenu extends React.Component<any, any> {
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
          customBurgerIcon={false}
          disableCloseOnEsc={Boolean(true)}
          isOpen={this.state.menuOpen}
          noOverlay={true}
          onStateChange={this.handleStateChange}
          right={false}
          styles={contentTreeMenuStyle}
          width='275px'
        >
          <ContentTree
            menuOpen={this.state.menuOpen}
            osd={this.state.osd}
          />
        </Menu>
        <button
          aria-label='toggle Content Tree'
          className="button-transparent"
          onClick={this.toggleContentTreeMenu}
          title='Content Tree'
          type="button"
        >
          <ContentTreeIcon />
        </button>
      </div>
    )
  }
}
