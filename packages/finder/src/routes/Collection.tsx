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
  TopBar,
  ViewSwitcherHits,
  ViewSwitcherToggle,
} from 'searchkit-fork'
import {AuthUserProfile, AuthUserTooltip, BMenu, Logo} from '../components/ui'
import {Domain, Routes} from '../constants'
import '../styles/index.css'
import {asCollection} from './asCollection'
import {IRouteProps} from './IRouteProps'
import StandardListItem from "../components/items/StandardListItem";
import StandardGridItem from "../components/items/StandardGridItem";

const ReactTooltip = require('react-tooltip')

class Collection extends React.Component<IRouteProps, {}> {

  static defaultProps = {
    options: {
      timeout: 20000},
  }

  static buildHitComponents(gridItem, listItem, listDefault) {
    const gridObj = {
      itemComponent: gridItem,
      key: 'grid',
      title: 'Grid',
    }
    const listObj = {
      itemComponent: listItem,
      key: 'list',
      title: 'List',
    }
    if (listDefault) {
      Object.defineProperty(listObj, 'defaultOption', {value: true});
    } else {
      Object.defineProperty(gridObj, 'defaultOption', {value: true});
    }
    return [gridObj, listObj]
  }

  state: {
    components: [any, any],
    width: number,
  }
  searchkit: SearchkitManager
  cachedHits: any
  routeKey: string
  routeProps: IRouteProps
  dataLayer: object

  constructor(props) {
    super(props);
    this.state = {
      components: [StandardGridItem, StandardListItem],
      width: props.width,
    }
    this.routeProps = props.config
    this.routeKey = props.config.routeConfig.indexName
    const host = process.env.REACT_APP_ELASTICSEARCH_HOST + this.routeKey
    this.searchkit = new SearchkitManager(host, props.options)
  }

  addComponent = async (type) => {
    import(`../components/items/${type}`)
      .then((component) =>
        this.setState({
          components: this.state.components.concat(component.default),
        }),
      )
      .catch((error) => {
        console.log(error);
      })
  }

  componentDidMount() {
    const {items} = this.props
    items.map((type) => this.addComponent(type))
  }

  componentDidUpdate(prevProps) {
    this.dataLayer = (window as any).schemaDataLayer ? (window as any).schemaDataLayer : null
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
  }

  buildSearchBox(routeConfig) {
    const {width} = this.state
    const isMobile = width <= 500
    if (isMobile) {
      return null
    } else {
      return(
        <SearchBox
          autofocus={true}
          searchOnChange={true}
          queryFields={routeConfig.queryFields}
        />)
    }
  }

  buildFilters(routeConfig) {
    const {width} = this.state
    const isMobile = width <= 500
    if (isMobile) {
      return null
    } else {
      return (
        <SideBar>
        <RefinementListFilter
          containerComponent={<Panel collapsable={true} defaultCollapsed={false}/>}
          field={routeConfig.refinementListFilterDef1.field}
          title={routeConfig.refinementListFilterDef1.title}
          id={routeConfig.refinementListFilterDef1.id}
          operator='AND'
          listComponent={ItemList}
        />
        <RefinementListFilter
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
          field={routeConfig.refinementListFilterDef2.field}
          title={routeConfig.refinementListFilterDef2.title}
          id={routeConfig.refinementListFilterDef2.id}
          operator='AND'
          listComponent={ItemList}
        />
        <RefinementListFilter
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
          field={routeConfig.refinementListFilterDef3.field}
          title={routeConfig.refinementListFilterDef3.title}
          id={routeConfig.refinementListFilterDef3.id}
          operator='AND'
          listComponent={ItemList}
        />
      </SideBar>
      )
   }
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
          <div id='outer-container'>
            <BMenu/>
            <div id='page-wrap'>
              <Layout>
                <TopBar>
                  <div className='my-logo'>
                    <Link className='my-logo' to={Routes.LANDING}>
                      <Logo className='JUQOtf'/>
                      <div className='JUQOtq'>{Domain.LOGO_TEXT}</div>
                    </Link>
                  </div>
                  {this.buildSearchBox(routeConfig)}
                  <div data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
                    <AuthUserProfile/>
                  </div>
                  <ReactTooltip
                    id='authUserProfile'
                    offset={{left: 170}}
                    globalEventOff='click'
                    border={t}
                    place='bottom'
                    type='light'
                    effect='solid'
                  >
                    <AuthUserTooltip/>
                  </ReactTooltip>
                </TopBar>
                <LayoutBody>
                  {this.buildFilters(routeConfig)}
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
                        <RangeFilter
                          field={routeConfig.rangeFilter.field}
                          id={routeConfig.rangeFilter.id}
                          min={routeConfig.rangeFilter.min}
                          max={routeConfig.rangeFilter.max}
                          showHistogram={true}
                          title='Date Selector'
                        />
                      </div> : null
                    }
                    <ViewSwitcherHits
                      hitsPerPage={50}
                      highlightFields={routeConfig.highlightFields}
                      hitComponents={Collection.buildHitComponents(gridItem, listItem, routeConfig.listDefault)}
                      scrollTo='body'
                    />
                    <NoHits suggestionsField={routeConfig.suggestionField}/>
                    <Pagination showNumbers={true}/>
                  </LayoutResults>
                </LayoutBody>
              </Layout>
            </div>
          </div>
        </SearchkitProvider>)
    } else {
      return null
    }
  }
}

export default asCollection(Collection)
