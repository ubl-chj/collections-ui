import React, {Component} from 'react'
import extend from 'lodash/extend'
import '../env'
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
} from 'searchkit'
import '../assets/index.css'
import * as domain from '../constants/domain';

const host = process.env.REACT_APP_ELASTICSEARCH_LOCALHOST + process.env.REACT_APP_ATOMIC_INDEX
const options = {
  timeout: 20000
}
const searchkit = new SearchkitManager(host, options)
const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
const osdUrl = process.env.REACT_APP_OSD_BASE

const ManifestHitsGridItem = (props) => {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = source.iiifService + '/full/pct:25/0/default.jpg'
  const url = source.iiifService + '/full/full/0/default.jpg'
  const pathname = new URL(source.iiifService).pathname
  const splitPath = pathname.split('/')
  const viewId = splitPath[5]
  const viewerUrl = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
  const titleString = source.metadata.Title.substr(0, 50) + '... : ' + source.imageIndex
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <div className={bemBlocks.item('poster')}>
        <a href={url} target='_blank' rel='noopener noreferrer'><img className={bemBlocks.item('poster')} alt='presentation'
                                           data-qa='poster' src={thumbnail} width='140'/></a>
      </div>
      <a href={viewerUrl} target='_blank' rel='noopener noreferrer'>
        <div data-qa='title' className={bemBlocks.item('title')}
             dangerouslySetInnerHTML={{__html: titleString}}/>
      </a>
    </div>
  )
}

const queryBuilder = (queryString) => {
  const queryFields = ['iiifService', 'structureMap.1.@id', 'structureMap.1.label', 'metadata.Date', 'metadata.Title', 'metadata.Author',
    'metadata.Date of publication', 'metadata.Call number', 'metadata.Collection', 'metadata.Objekttitel', 'metadata.Part of',
    'metadata.Place', 'metadata.Place of publication', 'metadata.Publisher', 'metadata.Sprache', 'metadata.URN', 'metadata.Source PPN (SWB)']
  return {
    'bool': {
      'should': [
        {
          'nested': {
            'path': 'contentList',
            'query': {
              'bool': {
                'must': [
                  {'match': {'contentList.chars': queryString}}
                ],
              }
            },
            'inner_hits': {}
          }
        },
        {
          'simple_query_string':
            {
              'query': queryString,
              'fields': queryFields
            }
        }
      ]
    }
  }
}

const InnerHits = (innerHits) => {
  const content = []
  if (innerHits.contentList != null) {
    innerHits.contentList.hits.hits.forEach(function(hit) {
      content.push(hit._source)
    })
  }
  return content
}

const ManifestsListItem = (props) => {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const innerHits = extend({}, result.inner_hits)
  const thumbnail = source.iiifService + '/full/90,/0/default.jpg'
  const url = source.iiifService + '/full/full/0/default.jpg'
  const pathname = new URL(source.iiifService).pathname
  const splitPath = pathname.split('/')
  const viewId = splitPath[5]
  const viewerUrl = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
  const constManifestUrl = generatorUrl + '?type=atomic&q='
  const query = '{\'query\':{\'multi_match\':{\'query\':\'' + viewId + '\',\'type\':\'cross_fields\',\'operator\':\'and\'}},\'size\':500}'
  const contentObjs = (
    <ul className='list-group'>
      {InnerHits(innerHits).map((hit) =>
        <li className='list-group-item' key={hit.objectId}>
          <a href={osdUrl + '?image=' + source.iiifService + '&region=' + hit.region} target='_blank' rel='noopener noreferrer'>{hit.chars}</a>
        </li>
      )}
    </ul>)

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <div className={bemBlocks.item('poster')}>
        <a href={url} target='_blank'><img className='thumbnail' alt='presentation' data-qa='poster'
                                           src={thumbnail}/></a>
      </div>
      <div className={bemBlocks.item('details')}>
        <a href={viewerUrl} target='_blank'>
          <h2 className={bemBlocks.item('title')}
              dangerouslySetInnerHTML={{__html: source.metadata.Title}}/></a>
        <table>
          <tbody>
          <tr>
            <td>Image Index:</td>
            <td>{source.imageIndex}</td>
          </tr>
          <tr>
            <td>Author:</td>
            <td>{source.metadata.Author}</td>
          </tr>
          <tr>
            <td>Date:</td>
            <td>{source.metadata.Date} {source.metadata['Date of publication']} {source.metadata['Datierung']} {source.metadata['datiert']}</td>
          </tr>
          <tr>
            <td>Content Coordinates:</td>
            <td>{contentObjs}</td>
          </tr>
          <tr>
            <td>Composite Manifest:</td>
            <td><a href={constManifestUrl + query} target='_blank' rel='noopener noreferrer'>{viewId}</a></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

class Atomic extends Component {
  render () {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className='my-logo'>{domain.LOGO_TEXT}</div>
            <SearchBox queryBuilder={queryBuilder} autofocus={true} searchOnChange={true}
            />
          </TopBar>

          <LayoutBody>
            <SideBar>
              <RefinementListFilter id='tag1' title='Collection'
                                    field='metadata.Collection.keyword' orderKey='_term'
                                    operator='AND'/>
            </SideBar>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats translations={{
                    'hitstats.results_found': '{hitCount} results found'
                  }}/>
                  <ViewSwitcherToggle/>
                  <SortingSelector options={[
                    {
                      label: 'Index', key: 'index', fields: [
                        {field: 'metadata.Title.keyword', options: {order: 'asc'}},
                        {field: 'imageIndex', options: {order: 'asc'}}
                      ]
                    }
                  ]}/>
                </ActionBarRow>
                <ActionBarRow>
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
              </ActionBar>
              <ViewSwitcherHits
                hitsPerPage={50} highlightFields={['metadata.Title']}
                sourceFilter={['iiifService', 'imageIndex', 'metadata.Title', 'metadata.Date',
                  'metadata.Author', 'metadata.Date of publication', 'metadata.Datierung', 'metadata.datiert',
                  'metadata.Collection', 'metadata.Objekttitel', 'metadata.Part of',
                  'metadata.Place', 'metadata.Place of publication',
                  'metadata.Publisher', 'metadata.Sprache', 'metadata.URN',
                  'metadata.Source PPN (SWB)']}
                hitComponents={[
                  {
                    key: 'grid',
                    title: 'Grid',
                    itemComponent: ManifestHitsGridItem,
                    defaultOption: true
                  },
                  {key: 'list', title: 'List', itemComponent: ManifestsListItem}
                ]}
                scrollTo='body'
              />
              <NoHits suggestionsField={'metadata.Title'}/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    )
  }
}

export default Atomic
