import * as _ from "lodash"
import * as React from 'react'
import {Link} from 'react-router-dom'
import {
  ActionBar,
  ActionBarRow,
  GroupedSelectedFilters,
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
import '../../assets/index.css'
import {Domain, Routes} from '../../constants'
import {CollectionsListItem} from '../items'
import {AuthUserProfile, AuthUserTooltip} from '../ui'
import {IRouteProps} from './IRouteProps'

const ReactTooltip = require('react-tooltip')

export class Landing extends React.Component<IRouteProps, {}> {

  static defaultProps = {
    host: process.env.REACT_APP_ELASTICSEARCH_HOST,
    options: {timeout: 20000},
    routeConfig: require('./config/landing.json'),
  }
  searchkit: SearchkitManager
  cachedHits: any
  routeKey: string
  state: {
    components: [],
    result: object,
  }

  constructor(props) {
    super(props)
    this.routeKey = this.props.routeConfig.indexName
    const host = props.host + this.routeKey
    this.searchkit = new SearchkitManager(host, props.options)
    this.state = {
      components: [],
      result: {},
    }
  }

  componentDidMount() {
    this.cachedHits = sessionStorage.getItem(this.routeKey);
    this.setState({result: null})
  }

  componentDidUpdate() {
    //this.handleSessionPersistence()
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
              <RefinementListFilter id='tag1' title='Collection' field='metadataMap.tag1.keyword' orderKey='_term' operator='AND'/>
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
              <ViewSwitcherHits hitsPerPage={50} highlightFields={['metadataMap.tag1']}
                hitComponents={[{key: 'list', title: 'List', itemComponent: CollectionsListItem}]} scrollTo='body'/>
              <NoHits suggestionsField={'metadataMap.tag1'}/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>)
  }
}
