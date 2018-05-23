import React, { Component } from 'react'
import extend from 'lodash/extend'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import './index.css'

const host = "http://localhost:9100/m"
const searchkit = new SearchkitManager(host)

const ManifestsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://workspaces.ub.uni-leipzig.de:9001/#?c=0&m=0&s=0&cv=0&manifest=" + result._source.metadataMap["@id"]
  const source = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img alt="presentation" data-qa="poster" src={result._source.metadataMap["@id"]}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.metadataMap.Title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>{source.metadataMap.Date}</h3>
      </div>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">UBL</div>
            <SearchBox autofocus={true} searchOnChange={true}
              queryFields={["metadataMap.Date", "metadataMap.Title"]}
            />
          </TopBar>

        <LayoutBody>

          <SideBar>
          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <ViewSwitcherHits
                hitsPerPage={12} highlightFields={["metadataMap.Title"]}
                sourceFilter={["metadataMap.Title", "metadataMap.@id","metadataMap.Date"]}
                hitComponents={[
                  {key:"list", title:"List", itemComponent:ManifestsListItem}
                ]}
                scrollTo="body"
            />
            <NoHits suggestionsField={"metadataMap.Title"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
