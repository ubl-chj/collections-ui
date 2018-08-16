import * as React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {
  ActionBar,
  ActionBarRow,
  GroupedSelectedFilters,
  HitsStats,
  ItemList,
  Layout,
  LayoutBody,
  LayoutResults,
  NoHits,
  Pagination,
  Panel,
  RangeFilter,
  RefinementListFilter,
  ResetFilters,
  SearchBox,
  SearchkitManager,
  SearchkitProvider,
  SideBar,
  SortingSelector,
  TagCloud,
  TopBar,
  ViewSwitcherHits,
  ViewSwitcherToggle
} from 'searchkit-fork'
import {AuthUserProfile, AuthUserTooltip} from '../ui'
import {Domain, Routes} from '../../constants'
import '../../assets/index.css'
import {asCollection} from './asCollection'
import {RouteProps} from './RouteProps'
import * as _ from "lodash"

const ReactTooltip = require('react-tooltip')

class Collection extends React.Component<RouteProps, {}> {
  state: {
    components: []
  }
  props: any;
  searchkit: SearchkitManager
  cachedHits: any
  routeKey: string
  routeProps: RouteProps

  static defaultProps = {
    options: {timeout: 20000}
  }

  addComponent = async type => {
    import(`../items/${type}` )
      .then(component =>
        this.setState({
          components: this.state.components.concat(component.default)
        })
      )
      .catch(error => {
        console.log(error);
      })
  }

  constructor(props) {
    super(props);
    this.state = {
      components: []
    }
    this.routeProps = props.config
    this.routeKey = props.config.routeConfig.indexName
    const host = process.env.REACT_APP_ELASTICSEARCH_HOST + this.routeKey
    this.searchkit = new SearchkitManager(host, props.options)
  }

  componentDidMount() {
    const {items} = this.props
    items.map(type => this.addComponent(type))
  }

  static buildHitComponents(gridItem, listItem, listDefault) {
    let items = []
    if (!listDefault) {
      items = [
        {
          key: 'grid',
          title: 'Grid',
          itemComponent: gridItem,
          defaultOption: true
        },
        {
          key: 'list',
          title: 'List',
          itemComponent: listItem
        }
      ]
    } else {
      items = [
        {
          key: 'grid',
          title: 'Grid',
          itemComponent: gridItem
        },
        {
          key: 'list',
          title: 'List',
          itemComponent: listItem,
          defaultOption: true
        }
      ]
    }
    return items
  }

  render() {
    const {routeConfig} = this.routeProps
    const {components} = this.state;
    if (components.length >= 2 && components[0] !== 'undefined') {
      const gridItem = components[0]
      const listItem = components[1]
      const t = Boolean(true)
      return (
        <SearchkitProvider searchkit={this.searchkit}>
          <Layout>
            <TopBar>
              <div className='my-logo'>
                <Link className='my-logo' to={Routes.LANDING}>{Domain.LOGO_TEXT}</Link>
              </div>
              <SearchBox autofocus={true} searchOnChange={true} queryFields={routeConfig.queryFields}/>
              <div data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
                <AuthUserProfile/>
              </div>
              <ReactTooltip id='authUserProfile' offset={{left: 170}} globalEventOff='click' border={t} place='bottom' type='light'
                effect='solid'>
                <AuthUserTooltip/>
              </ReactTooltip>
            </TopBar>
            <LayoutBody>
              <SideBar>
                <RefinementListFilter containerComponent={<Panel collapsable={true} defaultCollapsed={false}/>}
                  field={routeConfig.refinementListFilterDef1.field} title={routeConfig.refinementListFilterDef1.title}
                  id={routeConfig.refinementListFilterDef1.id} operator='AND' listComponent={ItemList}/>
                <RefinementListFilter containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
                  field={routeConfig.refinementListFilterDef2.field} title={routeConfig.refinementListFilterDef2.title}
                  id={routeConfig.refinementListFilterDef2.id} operator='AND' listComponent={ItemList}/>
                <RefinementListFilter containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
                  field={routeConfig.refinementListFilterDef3.field} title={routeConfig.refinementListFilterDef3.title}
                  id={routeConfig.refinementListFilterDef3.id} operator='AND' listComponent={ItemList}/>
              </SideBar>
              <LayoutResults>
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
                {routeConfig.hasRangeFilter ?
                  <div className='ex1'>
                    <RangeFilter field={routeConfig.rangeFilter.field} id={routeConfig.rangeFilter.id} min={routeConfig.rangeFilter.min}
                      max={routeConfig.rangeFilter.max} showHistogram={true} title='Date Selector'/>
                  </div> : null
                }
                <ViewSwitcherHits hitsPerPage={50} highlightFields={routeConfig.highlightFields}
                  hitComponents={Collection.buildHitComponents(gridItem, listItem, routeConfig.listDefault)} scrollTo='body'/>
                <NoHits suggestionsField={routeConfig.suggestionField}/>
                <Pagination showNumbers={true}/>
              </LayoutResults>
            </LayoutBody>
          </Layout>
        </SearchkitProvider>)
    } else {
      return null
    }
  }
}

export default asCollection(Collection)
