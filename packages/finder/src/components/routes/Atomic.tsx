import * as React from 'react'

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
  Panel,
  RefinementListFilter,
  ResetFilters,
  SearchBox,
  SearchkitManager,
  SearchkitProvider,
  SideBar,
  SortingSelector, Tabs,
  TagCloud,
  TermQuery,
  TopBar,
  ViewSwitcherHits,
  ViewSwitcherToggle
} from 'searchkit-fork'
import {AuthUserProfile, AuthUserTooltip, GridItem, ListItem} from '../ui/index'
import {Routes, Domain} from '../../constants'
import '../../assets/index.css'

const ReactTooltip = require('react-tooltip')
const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_ATOMIC_INDEX
const options = {
  timeout: 20000
}
const searchkit = new SearchkitManager(host, options)
const queryFields = ['iiifService', 'structureMap.1.@id', 'structureMap.1.label', 'metadata.Date', 'metadata.Title',
  'metadata.Author', 'metadata.Date of publication', 'metadata.Call number', 'metadata.Collection',
  'metadata.Objekttitel', 'metadata.Part of', 'metadata.Place', 'metadata.Place of publication',
  'metadata.Publisher', 'metadata.Sprache', 'metadata.URN', 'metadata.Source PPN (SWB)']

searchkit.addDefaultQuery((query) => {
  return query.addQuery(TermQuery('imageIndex', '00000001'))
})

export class Atomic extends React.Component {
  render () {
    const t = Boolean(true)
    return (
      <SearchkitProvider searchkit={searchkit}>
      <Layout>
        <TopBar>
          <div className='my-logo'><a className='my-logo' href={Routes.LANDING} target='_blank'>{Domain.LOGO_TEXT}</a></div>
          <SearchBox autofocus={true} searchOnChange={true} queryFields={queryFields}/>
          <div data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
            <AuthUserProfile/>
          </div>
          <ReactTooltip id='authUserProfile' offset={{left: 170}} globalEventOff='click' border={t} place='bottom' type='light' effect='solid'>
            <AuthUserTooltip/>
          </ReactTooltip>
        </TopBar>
        <LayoutBody>
          <SideBar>
            <RefinementListFilter containerComponent={<Panel collapsable={true} defaultCollapsed={false}/>}
              field='metadata.Sprache.keyword' title='Language' id='language' listComponent={TagCloud}/>
            <RefinementListFilter containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
              id='collection' title='Collection' field='metadata.Collection.keyword' orderKey='_term' operator='AND'
              listComponent={TagCloud}/>
            <RefinementListFilter containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>} id='place'
              title='Place' field='metadata.Place.keyword' orderKey='_term' operator='AND' listComponent={TagCloud}/>
          </SideBar>
          <LayoutResults>
            <ActionBar>
              <ActionBarRow>
                <HitsStats translations={{'hitstats.results_found': '{hitCount} results found'}}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[{label: 'Date', field: 'metadata.Date of publication.keyword', order: 'asc'},
                  {label: 'Title', field: 'metadata.Title.keyword', order: 'asc'},
                  {label: 'Author', field: 'metadata.Author.keyword', order: 'asc'}]}/>
              </ActionBarRow>
              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>
            </ActionBar>
            <ViewSwitcherHits hitsPerPage={50} highlightFields={['metadata.Title']}
              hitComponents={[
                {key: 'grid', title: 'Grid', itemComponent: GridItem, defaultOption: true},
                {key: 'list', title: 'List', itemComponent: ListItem}
                ]}
              scrollTo='body'/>,
            <NoHits suggestionsField={'metadata.Title'}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>
        </LayoutBody>
      </Layout>
    </SearchkitProvider>)
  }
}
