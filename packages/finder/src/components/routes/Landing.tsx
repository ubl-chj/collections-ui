import * as React from 'react'
import {Link} from 'react-router-dom'
import {CollectionsListItem} from '../items'
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
  ViewSwitcherToggle
} from 'searchkit-fork'
import '../../assets/index.css'
import {AuthUserProfile, AuthUserTooltip} from '../ui'
import {Domain, Routes} from '../../constants'

const ReactTooltip = require('react-tooltip')
const host = process.env.REACT_APP_ELASTICSEARCH_HOST + 'a1'
const config = require('./config/landing.json')
const options = {
  timeout: 20000
}
const searchkit = new SearchkitManager(host, options)

export class Landing extends React.Component {
  render() {
    const t = Boolean(true)
    return (<SearchkitProvider searchkit={searchkit}>
      <Layout>
        <TopBar>
          <div className='my-logo'>
            <Link className='my-logo' to={Routes.LANDING}>{Domain.LOGO_TEXT}</Link>
          </div>
          <SearchBox autofocus={true} searchOnChange={true} queryFields={config.queryFields}/>
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
                <SortingSelector options={[{label: 'Collection', field: 'metadataMap.tag1.keyword', order: 'asc'},]}/>
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
