import React, {Component} from 'react'
import extend from 'lodash/extend'
import * as routes from '../constants/routes';
import * as domain from '../constants/domain';

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

const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_UBL_INDEX
const options = {
  timeout: 20000
}
const searchkit = new SearchkitManager(host, options)
const queryFields = ['@id', 'Date', 'Title', 'Author', 'Date of publication', 'Collection', 'Objekttitel', 'Part of',
  'Place', 'Place of publication', 'Publisher', 'Sprache', 'URN', 'Source PPN (SWB)']

const ManifestsListItem = (props) => {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const pathname = new URL(result._source['@id']).pathname
  const splitPath = pathname.split('/')
  const viewId = splitPath[1].padStart(10, '0')
  const katalogBase = 'https://katalog.ub.uni-leipzig.de/Search/Results?lookfor=record_id:'
  const url = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
  const firstId = viewId.substring(0, 4).padStart(4, '0')
  const secondId = viewId.substring(5, 8).padStart(4, '0')
  const thumbnail = process.env.REACT_APP_UBL_IMAGE_SERVICE_BASE + firstId + '/' + secondId + '/' + viewId + '/00000001.jpx/full/90,/0/default.jpg'
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <div className={bemBlocks.item('poster')}>
        <img className='thumbnail' alt='presentation' data-qa='poster' src={thumbnail}/>
      </div>
      <div className={bemBlocks.item('details')}>
        <a href={url} target='_blank' rel='noopener noreferrer'>
          <h2 className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: source.Title}}/></a>
        <table>
          <tbody>
          <tr>
            <td>Author:</td>
            <td>{source.Author}</td>
          </tr>
          <tr>
            <td>Date:</td>
            <td>{source.Date} {source['Date of publication']} {source['Datierung']} {source['datiert']}</td>
          </tr>
          <tr>
            <td>Katalog URI:</td>
            <td><a href={katalogBase + source['Source PPN (SWB)']} target='_blank' rel='noopener noreferrer'> {source['Source PPN (SWB)']}</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>)
}

class Ubl extends Component {

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
              <RefinementListFilter id='tag1' title='Collection' field='Collection.keyword' orderKey='_term'
                operator='AND'/>
            </SideBar>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats translations={{'hitstats.results_found': '{hitCount} results found'}}/>
                  <ViewSwitcherToggle/>
                  <SortingSelector options={[{label: 'Date', field: 'Date of publication.raw', order: 'asc'},
                    {label: 'Title', field: 'Title.keyword', order: 'asc'},
                    {label: 'Author', field: 'Author.keyword', order: 'asc'}]}/>
                </ActionBarRow>
                <ActionBarRow>
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
              </ActionBar>
              <div className='ex1'>
                <RangeFilter field='Date of publication.raw' id='date' min={1470} max={1975} showHistogram={true}
                  title='Date Selector'/>
              </div>
              <ViewSwitcherHits hitsPerPage={12} highlightFields={['Title']}
                sourceFilter={queryFields}
                hitComponents={[{key: 'list', title: 'List', itemComponent: ManifestsListItem}]} scrollTo='body'/>
              <NoHits suggestionsField={'Title'}/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>)
  }
}

export default Ubl
