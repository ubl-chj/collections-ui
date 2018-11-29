import {DynamicLayoutContext, NavMenu} from 'collections-ui-common'
import * as _ from 'lodash'
import * as React from 'react'
import {Link} from 'react-router-dom'
import {
  Layout,
  LayoutBody,
  LayoutResults,
  NoHits,
  Pagination,
  RefinementListFilter,
  SearchkitManager,
  SearchkitProvider,
  SideBar,
  ViewSwitcherHits,
} from 'searchkit-fork'
import {CollectionsGridItem, CollectionsListItem} from '../items'
import {HeadMeta} from '../schema'
import {ActionBarComponent, Head} from '../ui'
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
    isMobile: boolean,
  }

  constructor(props) {
    super(props)
    this.routeKey = this.props.routeConfig.indexName
    const host = props.host + this.routeKey
    this.searchkit = new SearchkitManager(host, props.options)
    this.state = {
      components: [],
      filterMenuVisible: false,
      isMobile: props.isMobile,
      searchBoxVisible: false,
    }
  }

  componentDidMount() {
    // this.cachedHits = sessionStorage.getItem(this.routeKey)
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchkit !== prevProps.searchkit) {
      this.setState({refreshItem: true})
    }
    if (this.props.isMobile !== prevProps.isMobile) {
      this.setState({isMobile: this.props.isMobile})
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

  buildSideBar() {
    const {isMobile} = this.state
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

  render() {
    const {routeConfig} = this.props
    const {isMobile} = this.state
    const gridObj = {
      defaultOption: true,
      itemComponent: CollectionsGridItem,
      key: 'grid',
      title: 'Grid',
    }
    const listObj = {
      itemComponent: CollectionsListItem,
      key: 'list',
      title: 'List',
    }
    return (
         <SearchkitProvider searchkit={this.searchkit}>
           <div style={{background: '#efefef'}} id='outer'>
             <HeadMeta/>
             <NavMenu/>
             <div id='inner'>
               <Layout>
                 <Head isMobile={isMobile} routeConfig={routeConfig}/>
                 <main>
                   <LayoutBody>
                     {this.buildSideBar()}
                     <LayoutResults>
                       <ActionBarComponent
                         isMobile={isMobile}
                         routeConfig={routeConfig}
                       />
                       <DynamicLayoutContext.Provider value={isMobile}>
                         <ViewSwitcherHits
                           hitsPerPage={50}
                           highlightFields={routeConfig.highlightFields}
                           hitComponents={[listObj, gridObj]}
                           scrollTo='body'
                         />
                       </DynamicLayoutContext.Provider>
                       <NoHits suggestionsField={'name'}/>
                       <Pagination showNumbers={true}/>
                     </LayoutResults>
                   </LayoutBody>
                 </main>
               </Layout>
             </div>
           </div>
         </SearchkitProvider>
       )
  }
}
