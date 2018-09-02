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
} from 'searchkit-fork'
import {CollectionsListItem} from '../components/items'
import {AuthUserProfile, AuthUserTooltip, BMenu, Logo} from '../components/ui'
import {Domain, Routes} from '../constants'
import '../styles/index.css'
import {IRouteProps} from './IRouteProps'

const ReactTooltip = require('react-tooltip')

export class Landing extends React.Component<IRouteProps, {}> {

  static defaultProps = {
    host: process.env.REACT_APP_ELASTICSEARCH_HOST,
    options: {timeout: 20000},
    routeConfig: require('./config/landing.json'),
    searchkit: {},
  }

  searchkit: SearchkitManager
  cachedHits: any
  routeKey: string
  state: {
    components: [],
  }

  constructor(props) {
    super(props)
    this.routeKey = this.props.routeConfig.indexName
    const host = props.host + this.routeKey
    this.searchkit = new SearchkitManager(host, props.options)
    this.state = {
      components: [],
    }
  }

  componentDidMount() {
    // this.cachedHits = sessionStorage.getItem(this.routeKey)
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchkit !== prevProps.searchkit) {
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

  render() {
    const {routeConfig} = this.props
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
                   <span className='JUQOtq'>{Domain.LOGO_TEXT}</span>
                 </Link>
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
                   field='name.keyword'
                   orderKey='_term'
                   operator='AND'
                 />
               </SideBar>
               <LayoutResults>
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
                 <Hits
                   hitsPerPage={50}
                   highlightFields={["title"]}
                   mod="sk-hits-list"
                   itemComponent={CollectionsListItem}
                 />
                 <NoHits suggestionsField={'name'}/>
                 <Pagination showNumbers={true}/>
               </LayoutResults>
             </LayoutBody>
           </Layout>
             </div>
           </div>
         </SearchkitProvider>
       )
  }
}
