import * as React from "react";
import {
  ActionBar,
  ActionBarRow,
  GroupedSelectedFilters,
  HitsStats,
  ResetFilters,
  SortingSelector,
  ViewSwitcherToggle,
} from "searchkit-fork";
import {IRouteProps} from "../routes/IRouteProps";
import {FilterMenu} from "./FilterMenu";

export class ActionBarComponent extends React.Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      width: props.width,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
  }

  render() {
    const {routeConfig} = this.props
    const {width} = this.state
    const isMobile = width <= 500
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
