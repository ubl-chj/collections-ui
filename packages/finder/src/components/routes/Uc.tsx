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
  Pagination, Panel,
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
const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_UC_INDEX
const options = {
  timeout: 20000
}
const searchkit = new SearchkitManager(host, options)
const queryFields = ['Date of Publication', 'Provenance', 'Place of Publication', 'Physical Location', 'Extent', 'Abstract', 'Former Owner(s)',
  'Associated Person(s)', 'Title', 'Publisher', 'title', 'Classmark', 'seeAlso', 'Origin Place',
  'title', 'Level of Description', 'Date of Creation', 'thumbnail', 'Material', 'Format', 'Language(s)', 'Bibliography', 'Subject(s)', 'Author(s) of the Record',
'Collection', 'Manifest']

const handleMissingImage = (target) => {
  return target.src = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
}

const getAuthor = (source, bemBlocks) => {
  if (source['Author(s) of the Record']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Author:</b> {source['Author(s) of the Record']}</h3>
  }
}

const getSubject = (source, bemBlocks) => {
  if (source['Subject(s)']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Subject:</b> {source['Subject(s)']}</h3>
  }
}
const UCListItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const thumbUrl = osdUrl + '?image=' + result._source['thumbnail']
  const viewUrl = viewerUrl + '?manifest=' + result._source['Manifest']
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={thumbUrl} target='_blank' rel='noopener noreferrer'>
        <img onError={(e) => {handleMissingImage(e.target as HTMLImageElement)}}
          alt='uc' src={thumbnail}/>
      </a>
    </div>
    <div className={bemBlocks.item('details')}>
      <a href={viewUrl} target='_blank' rel='noopener noreferrer'>
        <h2 className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: source['Title']}}/>
      </a>
      {getAuthor(source, bemBlocks)}
      {getSubject(source, bemBlocks)}
      <h3 className={bemBlocks.item('subtitle')}><b>Date:</b> {source['Date of Creation']} {source['Date of Publication']}</h3>
      <h3 className={bemBlocks.item('subtitle')}
        dangerouslySetInnerHTML={{__html: source['Abstract']}}/>
    </div>
  </div>)
}

export const UCGridItem = (props) => {
  const previewUrl = process.env.REACT_APP_OSD_BASE
  const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const thumbUrl = previewUrl + '?image=' + result._source['thumbnail']
  const viewUrl = viewerUrl + '?manifest=' + result._source['Manifest']
  let titleString
  if (source.Title.length >= 80) {
    titleString = source.Title.substr(0, 80) + '... '
  } else {
    titleString = source.Title
  }
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={thumbUrl} target='_blank' rel='noopener noreferrer'>
        <img width='140' onError={(e) => {
          handleMissingImage(e.target as HTMLImageElement)
        }} alt='uc' src={thumbnail}/>
      </a>
    </div>
    <a href={viewUrl} target='_blank' rel='noopener noreferrer'>
      <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: titleString}}/>
    </a>
  </div>)
}

export class Uc extends React.Component {
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
            <RefinementListFilter id='tag1' title='Collection' field='Collection.keyword'
              orderKey='_term' operator='AND' listComponent={TagCloud} containerComponent={<Panel collapsable={true} defaultCollapsed={false}/>}/>
            <RefinementListFilter field='Language(s).keyword' title='Language' id='language' orderKey='_term' operator='AND'
              listComponent={TagCloud} containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}/>
            <RefinementListFilter field='Subject(s).keyword' title='Subject' id='subject' orderKey='_term' operator='AND'
              containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}/>
          </SideBar>
          <LayoutResults>
            <ActionBar>
              <ActionBarRow>
                <HitsStats translations={{'hitstats.results_found': '{hitCount} results found'}}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label: 'Title', field: 'Title.keyword', order: 'asc'},
                  {label: 'Author of the Record', field: 'Author(s) of the Record.keyword', order: 'asc'},
                  {label: 'Subject', field: 'Subject(s).keyword', order: 'desc'},
                  {label: 'Relevance', field: '_score', order: 'desc'}
                  ]}/>
              </ActionBarRow>
              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>
            </ActionBar>
            <ViewSwitcherHits hitsPerPage={50} highlightFields={['title']}
              hitComponents={[
                {key: 'grid', title: 'Grid', itemComponent: UCGridItem},
                {key: 'list', title: 'List', itemComponent: UCListItem, defaultOption: true}
                ]} scrollTo='body'/>
            <NoHits translations={{
              'NoHits.NoResultsFound': 'No works found were found for {query}',
              'NoHits.DidYouMean': 'Search for {suggestion}',
              'NoHits.SearchWithoutFilters': 'Search for {query} without filters'
            }}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>
        </LayoutBody>
      </Layout>
    </SearchkitProvider>)
  }
}
