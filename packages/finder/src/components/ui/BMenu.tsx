import * as React from 'react';
import {push as Menu} from 'react-burger-menu'
import {ListGroup, ListGroupItem} from 'reactstrap'
import {Octicon} from './svg';

export class BMenu extends React.Component<any, any> {

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
        width: '24px',
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
          styles={BMenu.styles()}
          isOpen={this.state.menuOpen}
          noOverlay={true}
          onStateChange={this.handleStateChange}
          pageWrapId={'page-wrap'}
          outerContainerId={'outer-container'}
        >
          <ListGroup>
            <ListGroupItem
              tag="a"
              href="/api"
              action={true}
            >API
              <span className='soon'>soon...</span>
            </ListGroupItem>
            <ListGroupItem
              tag="a"
              href="https://github.com/ubl-chj/collections-ui"
              action={true}
            >
              <div className='title-flex'>
                <div className='JUQOtt'>
                  <Octicon/>
                </div>
                <span className='item-span'>Code Repository</span>
              </div>
            </ListGroupItem>
            <ListGroupItem
              tag="a"
              href="/contact"
              action={true}
            >Contact
              <span className='soon'>soon...</span>
            </ListGroupItem>
            <ListGroupItem
              tag="a"
              href="/docs"
              action={true}
            >Documentation
              <span className='soon'>soon...</span>
            </ListGroupItem>
          </ListGroup>
        </Menu>
      )
  }
}
