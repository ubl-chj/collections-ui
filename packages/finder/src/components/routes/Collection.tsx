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
} from 'searchkit-fork'
import {Domain, Routes} from '../../constants'
import '../../styles/index.css'
import {StandardGridItem, StandardListItem} from '../items';
import {AuthUserProfile, AuthUserTooltip, BMenu, CloseButton, FilterMenu, Logo, SearchIcon} from '../ui'
import {asCollection} from './asCollection'
import {IRouteProps} from './IRouteProps'

const ReactTooltip = require('react-tooltip')

class Collection extends React.Component<IRouteProps, any> {

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
    filterMenuVisible: boolean,
    searchBoxVisible: boolean,
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
      filterMenuVisible: false,
      searchBoxVisible: false,
      width: props.width,
    }
    this.routeProps = props.config
    this.routeKey = props.config.routeConfig.indexName
    const host = process.env.REACT_APP_ELASTICSEARCH_HOST + this.routeKey
    this.searchkit = new SearchkitManager(host, props.options)
  }

  addComponent = async (type) => {
    import(`../items/${type}`)
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

  toggleSearchBox = () => {
    this.setState((prevState) => {
      return {searchBoxVisible: !prevState.searchBoxVisible};
    })
  }

  buildSearchBox() {
    const {routeConfig} = this.routeProps
    const {width} = this.state
    const isMobile = width <= 500
    if (isMobile) {
      if (this.state.searchBoxVisible) {
        return (
          <TopBar>
            <SearchBox
              autofocus={true}
              searchOnChange={true}
              queryFields={routeConfig.queryFields}
            />
            <div className='JUQOtc'>
              <button className='sbico-d' type="button" onClick={this.toggleSearchBox}>
                <span className='z1asCe'>
                  <CloseButton/>
                </span>
              </button>
            </div>
          </TopBar>
        )
      }
      return (
        <div className='JUQOtc'>
          <button className='sbico-c' type="button" onClick={this.toggleSearchBox}>
              <span className='z1asCe'>
                <SearchIcon/>
              </span>
          </button>
        </div>
      )
    } else {
      return(
        <SearchBox
          autofocus={true}
          searchOnChange={true}
          queryFields={routeConfig.queryFields}
        />)
    }
  }

  buildAuthProfile() {
    const {width} = this.state
    const isMobile = width <= 500
    if (isMobile) {
      return null
    } else {
      return(
        <div data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
          <AuthUserProfile/>
        </div>)
    }
  }

  buildSideBar() {
    const {routeConfig} = this.routeProps
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

  toggleFilterMenu = () => {
    this.setState((prevState) => {
      return {filterMenuVisible: !prevState.filterMenuVisible};
    })
  }

  buildActionBar() {
    const {routeConfig} = this.routeProps
    const {width, filterMenuVisible} = this.state
    const isMobile = width <= 500
    if (isMobile) {
      return (
        <ActionBar>
          <ActionBarRow>
            <FilterMenu
              routeConfig={routeConfig}
              filterMenuVisible={filterMenuVisible}
            />
            <HitsStats translations={{'hitstats.results_found': '{hitCount} results found'}}/>
            <SortingSelector options={routeConfig.sortingSelectorOptions}/>
          </ActionBarRow>
          <ActionBarRow>
            <button type="button" className="btn btn-primary-outline btn-xs" onClick={this.toggleFilterMenu}>
              Filter »
            </button>
          </ActionBarRow>
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
                  {this.buildSearchBox()}
                  {this.buildAuthProfile()}
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
                  {this.buildSideBar()}
                  <LayoutResults>
                    {this.buildActionBar()}
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
