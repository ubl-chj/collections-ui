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
  TagCloud,
  TopBar,
  ViewSwitcherHits,
  ViewSwitcherToggle
} from 'searchkit-fork'
import {Routes, Domain} from '../../constants'
import '../../assets/index.css'
import {AuthUserProfile, AuthUserTooltip} from '../ui'

const extend = require('lodash/extend')
const ReactTooltip = require('react-tooltip')
const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_EC_INDEX
const options = {
  timeout: 20000
}
const searchkit = new SearchkitManager(host, options)
const queryFields = ['Century', 'Collection Name', 'DOI', 'Dimensions', 'Document Type', 'Location', 'Material',
  'Number of Pages', 'Shelfmark', 'Summary (English)', 'Text Language', 'Persons', 'Place of Origin (English)',
  'title', 'Title (English).trigram', 'related', 'thumbnail']

const handleMissingImage = (target) => {
  return target.src = 'https://www.e-codices.unifr.ch/img/frontend/logo-nav.png'
}

const ECListItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const thumbUrl = osdUrl + '?image=' + result._source['thumbnail']
  const url = result._source['related']
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={thumbUrl} target='_blank' rel='noopener noreferrer'>
        <img onError={(e) => {handleMissingImage(e.target as HTMLImageElement)}}
          alt='e-codices' src={thumbnail}/>
      </a>
    </div>
    <div className={bemBlocks.item('details')}>
      <a href={url} target='_blank' rel='noopener noreferrer'>
        <h2 className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: source.title}}/>
      </a>
      <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={createTitle(source)}/>
      <h3 className={bemBlocks.item('subtitle')}><b>Date of
        Origin:</b> {source['Date of Origin (English)']}</h3>
      <h3 className={bemBlocks.item('subtitle')}
        dangerouslySetInnerHTML={{__html: source['Summary (English)']}}/>
    </div>
  </div>)
}

function createTitle(source) {
  const title = source['Title (English)']
  return {__html: '<b>Title:</b> ' + title}
}

export const ECGridItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const thumbUrl = osdUrl + '?image=' + result._source['thumbnail']
  const url = result._source['related']
  let titleString
  if (source.title.length >= 80) {
    titleString = source.title.substr(0, 80) + '... '
  } else {
    titleString = source.title
  }
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={thumbUrl} target='_blank' rel='noopener noreferrer'>
        <img width='140' onError={(e) => {
          handleMissingImage(e.target as HTMLImageElement)
        }} alt='e-codices' src={thumbnail}/>
      </a>
    </div>
    <a href={url} target='_blank' rel='noopener noreferrer'>
      <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: titleString}}/>
    </a>
  </div>)
}

export class Ec extends React.Component {
  render() {
    const t = Boolean(true)
    return (<SearchkitProvider searchkit={searchkit}>
      <Layout>
        <TopBar>
          <div className='my-logo'><a className='my-logo' href={Routes.LANDING}
            target='_blank'>{Domain.LOGO_TEXT}</a></div>
          <SearchBox autofocus={true} searchOnChange={true} queryFields={queryFields}/>
          <div data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
            <AuthUserProfile/>
          </div>
          <ReactTooltip id='authUserProfile' offset={{left: 170}} globalEventOff='click' border={t}
            place='bottom' type='light' effect='solid'>
            <AuthUserTooltip/>
          </ReactTooltip>
        </TopBar>
        <LayoutBody>
          <SideBar>
            <RefinementListFilter field='Text Language.keyword' title='Language' id='language'
              listComponent={TagCloud}/>
            <RefinementListFilter id='tag1' title='Collection' field='Collection Name.keyword'
              orderKey='_term' operator='AND'/>
          </SideBar>
          <LayoutResults>
            <ActionBar>
              <ActionBarRow>
                <HitsStats translations={{'hitstats.results_found': '{hitCount} results found'}}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label: 'Relevance', field: '_score', order: 'desc'},
                  {label: 'Century', field: 'Century.keyword', order: 'asc'}
                  ]}/>
              </ActionBarRow>
              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>
            </ActionBar>
            <ViewSwitcherHits hitsPerPage={50} highlightFields={['title']}
              hitComponents={[
                {key: 'grid', title: 'Grid', itemComponent: ECGridItem},
                {key: 'list', title: 'List', itemComponent: ECListItem, defaultOption: true}
                ]} scrollTo='body'/>
            <NoHits translations={{
              'NoHits.NoResultsFound': 'No works found were found for {query}',
              'NoHits.DidYouMean': 'Search for {suggestion}',
              'NoHits.SearchWithoutFilters': 'Search for {query} without filters'
            }} suggestionsField={'Title (English).trigram'}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>
        </LayoutBody>
      </Layout>
    </SearchkitProvider>)
  }
}
