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
import '../index.css'

const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_EC_INDEX
const searchkit = new SearchkitManager(host)
const queryFields = ["Century", "Collection Name", "DOI", "Dimensions", "Document Type", "Location", "Material",
  "Number of Pages", "Shelfmark", "Summary (English)", "Text Language", "Persons",
  "Place of Origin (English)", "Title", "Title (English)"]

const ManifestsListItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const pathname = new URL(result._source["@id"]).pathname
  const splitPath = pathname.split("/")
  const nameParts = splitPath[3].split("-")
  const thumbBase = process.env.REACT_APP_EC_IMAGE_SERVICE_BASE + nameParts[0] + "/" + splitPath[3] + "/" + splitPath[3] + "_001r.jp2"
  const thumbnail = thumbBase + "/full/90,/0/default.jpg"
  const thumbUrl = osdUrl + "?image=" + thumbBase
  const url = "https://www.e-codices.unifr.ch/en/" + nameParts[0] + "/" + nameParts[1]
  return (<div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <a href={thumbUrl} target="_blank"><img onError={(e)=>{e.target.src="https://www.e-codices.unifr.ch/img/frontend/logo-nav.png"}} alt="e-codices" src={thumbnail}/></a>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank">
          <h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html: source.Title}}/>
        </a>
        <h3 className={bemBlocks.item("subtitle")}>Date of Origin: {source['Date of Origin (English)']}</h3>
        <h3 className={bemBlocks.item("subtitle")} dangerouslySetInnerHTML={{__html: source['Summary (English)']}}/>
      </div>
    </div>)
}

class Ec extends Component {
  render () {
    return (<SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo"><a className="my-logo" href="/" target="_blank">UBL</a></div>
            <SearchBox autofocus={true} searchOnChange={true}
              queryFields={queryFields}/>
          </TopBar>
          <LayoutBody>
            <SideBar>
              <RefinementListFilter id="tag1" title="Collection" field="Collection Name.keyword" orderKey="_term"
                operator="AND"/>
            </SideBar>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats translations={{"hitstats.results_found": "{hitCount} results found"}}/>
                  <ViewSwitcherToggle/>
                  <SortingSelector options={[{label: "Relevance", field: "_score", order: "desc"},]}/>
                </ActionBarRow>
                <ActionBarRow>
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
              </ActionBar>
              <ViewSwitcherHits hitsPerPage={12}
                highlightFields={queryFields}
                hitComponents={[{key: "list", title: "List", itemComponent: ManifestsListItem}]} scrollTo="body"/>
              <NoHits suggestionsField={"Title"}/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>)
  }
}

export default Ec
