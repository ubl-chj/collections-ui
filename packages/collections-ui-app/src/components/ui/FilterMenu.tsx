import {ActionBarRow, ItemList, RefinementListFilter} from 'searchkit'
import {push as Menu} from 'react-burger-menu'
import React, {ReactElement, useState} from 'react'

export const FilterMenu: React.FC<any> = (props): ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const styles = () => {
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

  const handleStateChange = () => {
    setIsMenuOpen(isMenuOpen)
  }

  const toggleFilterMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const {routeConfig} = props
  return (
    <ActionBarRow>
      <Menu
        customBurgerIcon={false}
        styles={styles()}
        isOpen={isMenuOpen}
        noOverlay={true}
        right={true}
        onStateChange={handleStateChange}
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
        onClick={toggleFilterMenu}
      >
        Filter »
      </button>
    </ActionBarRow>
  )
}
