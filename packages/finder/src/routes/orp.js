import React, {Component} from 'react'
import extend from 'lodash/extend'
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
  RangeFilter,
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
} from 'searchkit'
import '../assets/index.css'
import {AuthUserProfile, AuthUserTooltip} from '../components/ui'
import ReactTooltip from 'react-tooltip'
import * as routes from '../constants/routes';
import * as domain from '../constants/domain';

const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_ORP_INDEX
const options = {
  timeout: 20000
}
const searchkit = new SearchkitManager(host, options)
const osdUrl = process.env.REACT_APP_OSD_BASE
const queryFields = ['imageServiceIRI', 'metadataMap.tag1', 'metadataMap.tag2', 'metadataMap.tag3', 'metadataMap.tag4', 'metadataMap.tag5', 'metadataMap.tag6', 'metadataMap.tag7', 'metadataMap.tag8']
const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
const constManifestUrl = generatorUrl + '?type=orp&index=' + process.env.REACT_APP_ORP_INDEX + '&q='

const ManifestHitsGridItem = (props) => {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = source.imageServiceIRI + '/full/pct:25/0/default.jpg'
  const url = osdUrl + '?image=' + source.imageServiceIRI
  const viewer = process.env.REACT_APP_VIEWER_BASE + '/#?c=0&m=0&s=0&cv=0&manifest='
  let tag4 = source.metadataMap.tag4 || ''
  let tag5 = source.metadataMap.tag5 || ''
  let tag6 = source.metadataMap.tag6 || ''
  let tag7 = source.metadataMap.tag7 || ''
  let tag8 = source.metadataMap.tag8 || ''
  const query = getQuery(source.metadataMap.tag3 + ' ' + tag4 + ' ' + tag5 + ' ' + tag6 + ' ' + tag7 + ' ' + tag8)
  const titleString = source.metadataMap.tag3 + ' ' + source.metadataMap.tag5 + ' ' + source.metadataMap.tag7 + ' ' + source.metadataMap.tag8
  const finalTitle = titleString.substr(0, 50) + '...: ' + source.imageIndex
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={url} target='_blank' rel='noopener noreferrer'><img onError={(e) => {
        e.target.src = 'https://www.e-codices.unifr.ch/img/frontend/logo-nav.png'
      }} className={bemBlocks.item('poster')} alt='presentation' data-qa='poster' src={thumbnail} width='180'/></a>
    </div>
    <div><a href={viewer + encodeURIComponent(query)} target='_blank' rel='noopener noreferrer'>
      <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: finalTitle}}/>
    </a></div>
  </div>)
}

const ManifestsListItem = (props) => {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const viewerIRI = process.env.REACT_APP_VIEWER_BASE + '/#?c=0&m=0&s=0&cv=0&manifest='
  const thumbnail = source.imageServiceIRI + '/full/90,/0/default.jpg'
  const url = osdUrl + '?image=' + source.imageServiceIRI
  let tag4 = source.metadataMap.tag4 || ''
  let tag5 = source.metadataMap.tag5 || ''
  let tag6 = source.metadataMap.tag6 || ''
  let tag7 = source.metadataMap.tag7 || ''
  let tag8 = source.metadataMap.tag8 || ''
  const query = getQuery(source.metadataMap.tag3 + ' ' + tag4 + ' ' + tag5 + ' ' + tag6 + ' ' + tag7 + ' ' + tag8)

  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={url} target='_blank' rel='noopener noreferrer'><img onError={(e) => {
        e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
      }} className='thumbnail' alt='presentation' data-qa='poster' src={thumbnail}/></a>
    </div>
    <div className={bemBlocks.item('details')}>
      <table>
        <tbody>
        <tr>
          <td>Image:</td>
          <td>{source.imageIndex}</td>
        </tr>
        <tr>
          <td>Collection:</td>
          <td>{source.metadataMap.tag1}</td>
        </tr>
        <tr>
          <td>Date Range:</td>
          <td>{source.metadataMap.tag2}</td>
        </tr>
        <tr>
          <td>Composite Manifest:</td>
          <td><a href={viewerIRI + encodeURIComponent(query)} target='_blank'
            rel='noopener noreferrer'>{source.metadataMap.tag3} {source.metadataMap.tag5} {source.metadataMap.tag7} {source.metadataMap.tag8}</a>
          </td>
        </tr>
        </tbody>
      </table>
      <hr/>
    </div>
  </div>)
}

const getQuery = (params) => {
  const query = JSON.stringify({
    'query': {
      'simple_query_string': {
        'query': params, 'default_operator': 'and'
      }
    }, 'size': 500
  })
  return constManifestUrl + query
}

class Orp extends Component {

  render () {
    const t = Boolean(true)
    return (<SearchkitProvider searchkit={searchkit}>
      <Layout>
        <TopBar>
          <div className='my-logo'><a className='my-logo' href={routes.LANDING} target='_blank'>{domain.LOGO_TEXT}</a></div>
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
                <SortingSelector options={[{label: 'Index', field: 'imageIndex', order: 'asc'},]}/>
              </ActionBarRow>
              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>
            </ActionBar>
            <div className='ex1'>
              <RangeFilter field='metadataMap.tag3.raw' id='date' min={1641} max={1975} showHistogram={true}
                title='Date Selector'/>
            </div>
            <ViewSwitcherHits hitsPerPage={50} highlightFields={['metadataMap.tag1']}
              hitComponents={[{key: 'list', title: 'List', itemComponent: ManifestsListItem}, {
                key: 'grid', title: 'Grid', itemComponent: ManifestHitsGridItem
              }]} scrollTo='body'/>
            <NoHits suggestionsField={'metadataMap.tag1'}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>
        </LayoutBody>
      </Layout>
    </SearchkitProvider>)
  }
}

export default Orp
