import * as _ from "lodash"
import * as React from 'react'
import {Link} from 'react-router-dom'
import {
  ActionBar,
  ActionBarRow,
  GroupedSelectedFilters, Hits,
  HitsStats,
  Layout,
  LayoutBody,
  LayoutResults,
  NoHits,
  Pagination,
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
import {CollectionsListItem} from '../components/items'
import {RandomLandingItem} from '../components/items/RandomLandingItem';
import {AuthUserProfile, AuthUserTooltip, RefreshIcon} from '../components/ui'
import {Domain, Routes} from '../constants'
import '../styles/index.css'
import {IRouteProps} from './IRouteProps'

const ReactTooltip = require('react-tooltip')

export class Landing extends React.Component<IRouteProps, {}> {

  static defaultProps = {
    host: process.env.REACT_APP_ELASTICSEARCH_HOST,
    options: {timeout: 20000},
    randomIndex: process.env.REACT_APP_EC_INDEX,
    routeConfig: require('./config/landing.json'),
    searchkit2: {},
  }

  static randomQuery() {
    const val = (new Date()).getTime()
    return {
        function_score: {
          functions: [
            {
              random_score: {
                seed: val,
              },
            },
          ],
        },
      }
  }

  searchkit: SearchkitManager
  searchkit2: SearchkitManager
  cachedHits: any
  routeKey: string
  state: {
    components: [],
    refreshItem: boolean,
  }

  constructor(props) {
    super(props)
    this.routeKey = this.props.routeConfig.indexName
    const host = props.host + this.routeKey
    const host2 = props.host + props.randomIndex
    this.searchkit = new SearchkitManager(host, props.options)
    this.searchkit2 = new SearchkitManager(host2, props.options)
    this.searchkit2.addDefaultQuery((query) => query.addQuery(Landing.randomQuery()))
    this.state = {
      components: [],
      refreshItem: false,
    }
  }

  componentDidMount() {
    this.cachedHits = sessionStorage.getItem(this.routeKey);
    this.setState({refreshItem: true})
    this.refreshItem = this.refreshItem.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchkit2 !== prevProps.searchkit2) {
      this.setState({refreshItem: true})
    }
  }

  async handleSessionPersistence() {
    this.cachedHits = sessionStorage.getItem(this.routeKey);
    if (this.cachedHits === null || this.cachedHits === 'undefined') {
      const results = await JSON.stringify(this.searchkit.getResultsAndState().results)
      if (results !== 'undefined' && results) {
        sessionStorage.setItem(this.routeKey, results)
        this.setState({result: results})
      }
    } else if (this.cachedHits && this.cachedHits !== 'undefined') {
      this.searchkit.setResults(_.cloneDeep(JSON.parse(this.cachedHits)))
    }
  }

  refreshItem = () => this.setState({refreshItem: !this.state.refreshItem})

  renderRandomItem() {
    if (this.state.refreshItem) {
      return(
        <SearchkitProvider searchkit={this.searchkit2}>
        <ActionBar>
          <Hits
            hitsPerPage={1}
            highlightFields={["title"]}
            mod="sk-hits-list"
            itemComponent={RandomLandingItem}
          />
        </ActionBar>
      </SearchkitProvider>)
    }
  }
   render() {
    const {routeConfig} = this.props
    const t = Boolean(true)
    return (
      <SearchkitProvider searchkit={this.searchkit}>
        <Layout>
          <TopBar>
            <div className='my-logo'>
              <Link className='my-logo' to={Routes.LANDING}>{Domain.LOGO_TEXT}</Link>
            </div>
            <SearchBox
              autofocus={true}
              searchOnChange={true}
              queryFields={routeConfig.queryFields}
            />
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
            <SideBar>
              <RefinementListFilter
                id='tag1'
                title='Collection'
                field='metadataMap.tag1.keyword'
                orderKey='_term'
                operator='AND'
              />
            </SideBar>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats translations={{'hitstats.results_found': '{hitCount} results found'}}/>
                  <ViewSwitcherToggle/>
                  <SortingSelector options={[{label: 'Collection', field: 'metadataMap.tag1.keyword', order: 'asc'}]}/>
                </ActionBarRow>
                <ActionBarRow>
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
              </ActionBar>
              <button className='button-transparent' onClick={this.refreshItem}><RefreshIcon/></button>
              {this.renderRandomItem()}
              <ViewSwitcherHits
                hitsPerPage={50}
                highlightFields={['metadataMap.tag1']}
                hitComponents={[{key: 'list', title: 'List', itemComponent: CollectionsListItem, defaultOption: true},
                  {key: 'grid', title: 'Random', itemComponent: RandomLandingItem}]}
                scrollTo='body'
              />
              <NoHits suggestionsField={'metadataMap.tag1'}/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    )
  }
}
