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
import React from 'react'

export class ActionBarComponent extends React.Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      isMobile: props.isMobile,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isMobile !== prevProps.isMobile) {
      this.setState({isMobile: this.props.isMobile})
    }
  }

  render() {
    const {routeConfig} = this.props
    const {isMobile} = this.state
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
}
