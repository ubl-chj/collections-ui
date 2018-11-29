import * as React from 'react'
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
          disableCloseOnEsc={Boolean(true)}
          width='275px'
          styles={contentTreeMenuStyle}
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
