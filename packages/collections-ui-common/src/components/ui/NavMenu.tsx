import React from 'react'
import {push as Menu} from 'react-burger-menu'
import {ListGroup, ListGroupItem} from 'reactstrap'
import {API, Help, Octicon, Settings} from './svg'
import {Link} from 'react-router-dom'

export class NavMenu extends React.Component<any, any> {

  static styles() {
    return {
      bmBurgerBars: {
        background: 'white',
        height: '15%',
      },
      bmBurgerButton: {
        height: '13px',
        left: '24px',
        position: 'fixed',
        top: '24px',
        width: '18px',
      },
      bmCross: {
        background: '#000',
      },
      bmCrossButton: {
        height: '24px',
        left: '255px',
        width: '24px',
        top: '14px'
      },
      bmItem: {
        display: 'inline-block',
      },
      bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em',
      },
      bmMenu: {
        backgroundColor: '#efefef',
        borderRight: '1px solid lightgray',
        bottom: '0',
        boxSizing: 'border-box',
        left: '0',
        opacity: '1',
        padding: '2px',
        position: 'absolute',
        top: '0',
        transform: 'translateX(0)',
        width: '100%',
        wordWrap: 'break-word',
      },
      bmMenuWrap: {
        position: 'inherit',
      },
      bmMorphShape: {
        fill: '#373a47',
      },
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
    }
  }

  handleStateChange = (state) => {
    this.setState({menuOpen: state.menuOpen})
  }

  render() {
    return (
      <Menu
        styles={NavMenu.styles()}
        disableCloseOnEsc={Boolean(true)}
        isOpen={this.state.menuOpen}
        noOverlay={true}
        onStateChange={this.handleStateChange}
        pageWrapId={'inner'}
        outerContainerId={'outer'}
        width='280px'
      >
        <div style={{color: 'rgb(239, 239, 239)', height: '26px', lineHeight: '26px', marginLeft: '75px'}}>Navigation</div>
        <ListGroup>
          <li style={{listStyle: 'none'}}>
            <ListGroupItem
              tag="a"
              href="https://github.com/ubl-chj/collections-ui"
              target='_blank'
              rel='noopener noreferrer'
              action={true}
            >
              <div className='title-flex'>
                  <Octicon/>
                <span className='item-span'>Code Repository</span>
              </div>
            </ListGroupItem>
          </li>
            <ListGroupItem action={true}>
              <Link className='bmenu-list' title='Support' to='/support'>
                <div className='title-flex'>
                    <Help/>
                  <div className='item-span'>Help & Feedback</div>
                </div>
              </Link>
            </ListGroupItem>
            <ListGroupItem action={true}>
              <Link className='bmenu-list' title='Services' to='/services'>
                <div className='title-flex'>
                  <API/>
                  <div className='item-span'>API & Services</div>
                </div>
              </Link>
            </ListGroupItem>
            <ListGroupItem action={true}>
              <Link className='bmenu-list' title='Settings' to='/settings'>
                <div className='title-flex'>
                  <Settings/>
                  <div className='item-span'>Settings</div>
                </div>
              </Link>
            </ListGroupItem>
        </ListGroup>
      </Menu>
    )
  }
}
