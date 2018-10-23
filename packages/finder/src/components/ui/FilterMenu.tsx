import * as React from 'react';
import {push as Menu} from 'react-burger-menu'
import {ListGroup, ListGroupItem} from 'reactstrap'
import {ActionBarRow, ItemList, RefinementListFilter} from "searchkit-fork"

export class FilterMenu extends React.Component<any, any> {

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
        marginLeft: '0',
        opacity: '1',
        padding: '2px',
        position: 'absolute',
        top: '0',
        transform: 'translateX(0)',
        width: '340px',
        wordWrap: 'break-word',
      },
      bmMorphShape: {
        fill: '#373a47',
      },
    }
  }

  routeConfig: any

  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
    }
  }

  handleStateChange = (state) => {
    this.setState({menuOpen: state.menuOpen})
  }

  toggleFilterMenu = () => {
    this.setState((prevState) => {
      return {menuOpen: !prevState.menuOpen};
    })
  }

  render() {
    const {routeConfig} = this.props
    return (
      <ActionBarRow>
        <Menu
          customBurgerIcon={false}
          styles={FilterMenu.styles()}
          isOpen={this.state.menuOpen}
          noOverlay={true}
          right={true}
          onStateChange={this.handleStateChange}
          width='340px'
        ><br/>
            <RefinementListFilter
              field={routeConfig.refinementListFilterDef1.field}
              title={routeConfig.refinementListFilterDef1.title}
              id={routeConfig.refinementListFilterDef1.id}
              operator='AND'
              listComponent={ItemList}
            />
          <RefinementListFilter
            field={routeConfig.refinementListFilterDef2.field}
            title={routeConfig.refinementListFilterDef2.title}
            id={routeConfig.refinementListFilterDef2.id}
            operator='AND'
            listComponent={ItemList}
          />
          <RefinementListFilter
            field={routeConfig.refinementListFilterDef3.field}
            title={routeConfig.refinementListFilterDef3.title}
            id={routeConfig.refinementListFilterDef3.id}
            operator='AND'
            listComponent={ItemList}
          />
        </Menu>
        <button
          aria-label='toggle filters'
          type="button"
          className="btn btn-primary-outline btn-xs"
          onClick={this.toggleFilterMenu}
        >
          Filter »
        </button>
      </ActionBarRow>
    )
  }
}
