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
import {useMediaQuery} from '@material-ui/core';

export const ActionBarComponent: React.FC<any> = (props): ReactElement => {
  const {routeConfig} = props
  const matches = useMediaQuery('(max-width:600px)')
    return matches ? (
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
    ):
    (
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
