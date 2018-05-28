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
import '../index.css'

const host = "http://workspaces.ub.uni-leipzig.de:9100/m"
const searchkit = new SearchkitManager(host)

const ManifestsListItem = (props) => {
  const {bemBlocks, result} = props
  let imageServiceBase = "https://iiif.ub.uni-leipzig.de/iiif/j2k/"
  const source = extend({}, result._source, result.highlight)
  const pathname = new URL(result._source.metadataMap["@id"]).pathname
  const splitPath = pathname.split("/")
  const viewId = splitPath[1].padStart(10, '0')
  // const url = "http://workspaces.ub.uni-leipzig.de:9001/#?c=0&m=0&s=0&cv=0&manifest=" +
  //     result._source.metadataMap["@id"];
  const url = "https://digital.ub.uni-leipzig.de/object/viewid/" + viewId
  const firstId = viewId.substring(0, 4).padStart(4, '0')
  const secondId = viewId.substring(5, 8).padStart(4, '0')
  const thumbnail = imageServiceBase + firstId + "/" + secondId + "/" + viewId +
    "/00000001.jpx/full/90,/0/default.jpg"
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img alt="presentation" data-qa="poster" src={thumbnail}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank">
          <h2 className={bemBlocks.item("title")}
              dangerouslySetInnerHTML={{__html: source.metadataMap.Title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Author: {source.metadataMap.Author}</h3>
        <h3 className={bemBlocks.item(
          "subtitle")}>Date: {source.metadataMap.Date} {source.metadataMap['Date of publication']}</h3>
      </div>
    </div>
  )
}

class Ubl extends Component {
  render () {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">UBL</div>
            <SearchBox autofocus={true} searchOnChange={true}
                       queryFields={["metadataMap.Date", "metadataMap.Title", "metadataMap.Author",
                         "metadataMap.Date of publication",
                         "metadataMap.Collection", "metadataMap.Objekttitel", " metadataMap.Part of",
                         "metadataMap.Place", "metadataMap.Place of publication",
                         "metadataMap.Publisher", "metadataMap.Sprache", "metadataMap.URN"]}
            />
          </TopBar>

          <LayoutBody>

            <SideBar>
              <RefinementListFilter id="tag1" title="Collection"
                                    field="metadataMap.Collection.keyword" orderKey="_term"
                                    operator="AND"/>
            </SideBar>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats translations={{
                    "hitstats.results_found": "{hitCount} results found"
                  }}/>
                  <ViewSwitcherToggle/>
                  <SortingSelector options={[
                    {label: "Relevance", field: "_score", order: "desc"},
                  ]}/>
                </ActionBarRow>

                <ActionBarRow>
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>

              </ActionBar>
              <RangeFilter field="metadataMap.DateRange.raw" id="date" min={1641} max={1975}
                           showHistogram={true} title="Date Selector"/>
              <ViewSwitcherHits
                hitsPerPage={12} highlightFields={["metadataMap.Title"]}
                sourceFilter={["metadataMap.Title", "metadataMap.@id", "metadataMap.Date",
                  "metadataMap.Author", "metadataMap.Date of publication",
                  "metadataMap.Collection", "metadataMap.Objekttitel", " metadataMap.Part of",
                  "metadataMap.Place", "metadataMap.Place of publication",
                  "metadataMap.Publisher", "metadataMap.Sprache", "metadataMap.URN"]}
                hitComponents={[
                  {key: "list", title: "List", itemComponent: ManifestsListItem}
                ]}
                scrollTo="body"
              />
              <NoHits suggestionsField={"metadataMap.Title"}/>
              <Pagination showNumbers={true}/>
            </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    )
  }
}

export default Ubl
