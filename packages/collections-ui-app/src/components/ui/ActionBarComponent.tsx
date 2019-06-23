import {
  ActionBar,
  ActionBarRow,
  GroupedSelectedFilters,
  HitsStats,
  ResetFilters,
  SortingSelector,
  ViewSwitcherToggle,
} from 'searchkit'
import {FilterMenu} from './FilterMenu'
import React, {ReactElement} from 'react'

export const ActionBarComponent: React.FC<any> = (props): ReactElement => {
  const {isMobile, routeConfig} = props

  if (isMobile) {
    return (
      <ActionBar>
        <ActionBarRow>
          <HitsStats translations={{'hitstats.results_found': '{hitCount} results found'}}/>
          <ViewSwitcherToggle/>
          <SortingSelector options={routeConfig.sortingSelectorOptions}/>
        </ActionBarRow>
        <FilterMenu
          routeConfig={routeConfig}
        />
        <ActionBarRow>
          <GroupedSelectedFilters/>
          <ResetFilters/>
        </ActionBarRow>
      </ActionBar>
    )
  } else {
    return (
      <ActionBar>
        <ActionBarRow>
          <HitsStats translations={{'hitstats.results_found': '{hitCount} results found'}}/>
          <ViewSwitcherToggle/>
          <SortingSelector options={routeConfig.sortingSelectorOptions}/>
        </ActionBarRow>
        <ActionBarRow>
          <GroupedSelectedFilters/>
          <ResetFilters/>
        </ActionBarRow>
      </ActionBar>
    )
  }
}
