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
import {AuthUserTooltip, AuthUserProfile} from '../ui'
import {Routes, Domain} from '../../constants'
const extend = require('lodash/extend')
const ReactTooltip = require('react-tooltip')
const host = process.env.REACT_APP_ELASTICSEARCH_HOST + 'a1'

const options = {
  timeout: 20000
}
const searchkit = new SearchkitManager(host, options)
const queryFields = ['imageServiceIRI', 'metadataMap.tag1', 'metadataMap.tag2', 'metadataMap.tag3', 'metadataMap.tag4', 'metadataMap.tag5', 'metadataMap.tag6', 'metadataMap.tag7', 'metadataMap.tag8']

const handleMissingImage = (target) => {
  return target.src = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
}

const CollectionsListItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = source.imageServiceIRI + '/full/90,/0/default.jpg'
  const url = osdUrl + '?image=' + source.imageServiceIRI
  const updated = new Date(source.metadataMap.tag3).toDateString();
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={url} target='_blank' rel='noopener noreferrer'>
        <img onError={(e) => {handleMissingImage(e.target as HTMLImageElement)}}
          className='thumbnail' alt='presentation'
        data-qa='poster' src={thumbnail}/>
      </a>
    </div>
    <div className={bemBlocks.item('details')}>
      <table>
        <tbody>
        <tr>
          <td>Collection:</td>
          <td><a href={source.metadataMap.tag2} target='_blank' rel='noopener noreferrer'>{source.metadataMap.tag1}</a>
          </td>
        </tr>
        <tr>
          <td>Last Updated:</td>
          <td>{updated}</td>
        </tr>
        <tr>
          <td>Total Documents:</td>
          <td>{source.metadataMap.tag4}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>)
}

export class Landing extends React.Component {
  render () {
    const t = Boolean(true)
    return (<SearchkitProvider searchkit={searchkit}>
      <Layout>
        <TopBar>
          <div className='my-logo'><a className='my-logo' href={Routes.LANDING} target='_blank' rel='noopener noreferrer'>{Domain.LOGO_TEXT}</a>
          </div>
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
            <RefinementListFilter id='tag1' title='Collection' field='metadataMap.tag1.keyword' orderKey='_term'
              operator='AND'/>
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
