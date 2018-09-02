import * as React from 'react';
import {push as Menu} from 'react-burger-menu'
import {ListGroup, ListGroupItem} from 'reactstrap'
import {Octicon} from './svg';

export class BMenu extends React.Component<any, any> {

  static styles() {
    return {
      bmBurgerBars: {
        background: 'white',
        height: '10%',
      },
      bmBurgerButton: {
        height: '18px',
        position: 'fixed',
        width: '24px',
        left: '24px',
        top: '24px',
      },
      bmCrossButton: {
        height: '24px',
        width: '24px',
      },
      bmCross: {
        background: '#000',
      },
      bmMenu: {
        position: 'absolute',
        left: '0',
        bottom: '0',
        top: '0',
        backgroundColor: '#efefef',
        borderRight: '1px solid lightgray',
        boxSizing: 'border-box',
        padding: '2px',
        opacity: '1',
        width: '100%',
        transform: 'translateX(0)',
        wordWrap: 'break-word',
      },
      bmMorphShape: {
        fill: '#373a47',
      },
      bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em',
      },
      bmItem: {
        display: 'inline-block',
      },
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
    }
   }

  handleStateChange(state) {
    this.setState({menuOpen: state.menuOpen})
  }

  render() {
    return (
        <Menu
          styles={BMenu.styles()}
          isOpen={this.state.menuOpen}
          noOverlay={true}
          onStateChange={(state) => this.handleStateChange(state)}
          pageWrapId={'page-wrap'}
          outerContainerId={'outer-container'}
        >
          <ListGroup>
            <ListGroupItem
              tag="a"
              href="/api"
              action>API
              <span className='soon'>soon...</span>
            </ListGroupItem>
            <ListGroupItem tag="a"
              href="https://github.com/ubl-chj/collections-ui"
              action>
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
              action>Contact
              <span className='soon'>soon...</span>
            </ListGroupItem>
            <ListGroupItem
              tag="a"
              href="/docs"
              action>Documentation
              <span className='soon'>soon...</span>
            </ListGroupItem>
          </ListGroup>
        </Menu>
      )
  }
}
