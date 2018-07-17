import React, {Component} from 'react'
import extend from 'lodash/extend'
import {
  ActionBar,
  ActionBarRow,
  CheckboxFilter,
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
  TermQuery,
  TopBar,
  ViewSwitcherHits,
  ViewSwitcherToggle
} from 'searchkit'

import '../index.css'


const host = process.env.REACT_APP_ELASTICSEARCH_HOST + "a1"

const searchkit = new SearchkitManager(host)
const queryFields = ["imageServiceIRI", "metadataMap.tag1", "metadataMap.tag2", "metadataMap.tag3",
  "metadataMap.tag4", "metadataMap.tag5", "metadataMap.tag6", "metadataMap.tag7", "metadataMap.tag8"]

const CollectionsListItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = source.imageServiceIRI + "/full/90,/0/default.jpg"
  const url = osdUrl + "?image=" + source.imageServiceIRI
  let tag4 = source.metadataMap.tag4 || ''
  let tag5 = source.metadataMap.tag5 || ''
  let tag6 = source.metadataMap.tag6 || ''
  let tag7 = source.metadataMap.tag7 || ''
  let tag8 = source.metadataMap.tag8 || ''

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <a href={url} target="_blank"><img className="thumbnail" alt="presentation" data-qa="poster"
          src={thumbnail}/></a>
      </div>
      <div className={bemBlocks.item("details")}>
        <table>
          <tbody>
          <tr>
            <td>Collection:</td>
            <td><a href={source.metadataMap.tag2} target="_blank">{source.metadataMap.tag1}</a></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>)
}

class About extends Component {
  render () {
    return (<SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo"><a className="my-logo" href="/" target="_blank">UBL</a></div>
            <SearchBox autofocus={true} searchOnChange={true} queryFields={queryFields}/>
          </TopBar>
          <LayoutBody>
            <SideBar>
              <RefinementListFilter id="tag1" title="Collection" field="metadataMap.tag1.keyword" orderKey="_term"
                operator="AND"/>
            </SideBar>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats translations={{
                    "hitstats.results_found": "{hitCount} results found"
                  }}/>
                  <ViewSwitcherToggle/>
                  <SortingSelector options={[{label: "Index", field: "imageIndex", order: "asc"},]}/>
                </ActionBarRow>
                <ActionBarRow>
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
              </ActionBar>
              <ViewSwitcherHits hitsPerPage={50} highlightFields={["metadataMap.tag1"]}
                hitComponents={[{key: "list", title: "List", itemComponent: CollectionsListItem}]} scrollTo="body"/>
              <NoHits suggestionsField={"metadataMap.tag1"}/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    )
  }
}

export default About
