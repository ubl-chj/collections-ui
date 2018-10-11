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
import {Domain, Routes} from '../../constants'
import '../../styles/index.css'
import {CollectionsListItem} from '../items'
import {HeadMeta} from "../schema";
import {AuthProfile, BMenu, CloseButton, FilterMenu, Logo, SearchIcon} from '../ui'
import {IRouteProps} from './IRouteProps'

export class Landing extends React.Component<IRouteProps, any> {

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
    filterMenuVisible: boolean,
    searchBoxVisible: boolean,
    width: number,
  }

  constructor(props) {
    super(props)
    this.routeKey = this.props.routeConfig.indexName
    const host = props.host + this.routeKey
    this.searchkit = new SearchkitManager(host, props.options)
    this.state = {
      components: [],
      filterMenuVisible: false,
      searchBoxVisible: false,
      width: props.width,
    }
  }

  componentDidMount() {
    // this.cachedHits = sessionStorage.getItem(this.routeKey)
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchkit !== prevProps.searchkit) {
      this.setState({refreshItem: true})
    }
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
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

  toggleSearchBox = () => {
    this.setState((prevState) => {
      return {searchBoxVisible: !prevState.searchBoxVisible};
    })
  }

  buildSearchBox() {
    const {routeConfig} = this.props
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

  buildSideBar() {
    const { width } = this.state
    const isMobile = width <= 500
    if (isMobile) {
      return null
    } else {
      return(
      <SideBar>
        <RefinementListFilter
          id='tag1'
          title='Collection'
          field='name.keyword'
          orderKey='_term'
          operator='AND'
        />
      </SideBar>)
    }
  }

  buildActionBar() {
    const {routeConfig} = this.props
    const {width} = this.state
    const isMobile = width <= 500
    if (isMobile) {
      return (
        <ActionBar>
          <ActionBarRow>
            <HitsStats translations={{'hitstats.results_found': '{hitCount} results found'}}/>
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
    const {width} = this.state;
    return (
         <SearchkitProvider searchkit={this.searchkit}>
           <div id='outer-container'>
             <HeadMeta/>
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
                   {this.buildSearchBox()}
                   <AuthProfile width={width}/>
                 </TopBar>
                 <LayoutBody>
                   {this.buildSideBar()}
                   <LayoutResults>
                     {this.buildActionBar()}
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
