import React, {Component} from 'react'

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

import {
  GridItem,
  ListItem
} from 'ubl-viewer'

import '../index.css'
const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_ATOMIC_INDEX
const searchkit = new SearchkitManager(host)
const queryFields = ["iiifService", "structureMap.1.@id", "structureMap.1.label", "metadata.Date", "metadata.Title",
  "metadata.Author", "metadata.Date of publication", "metadata.Call number", "metadata.Collection", "metadata.Objekttitel",
  "metadata.Part of", "metadata.Place", "metadata.Place of publication", "metadata.Publisher", "metadata.Sprache",
  "metadata.URN", "metadata.Source PPN (SWB)"]

class Atomic extends Component {
  render () {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">UBL</div>
            <SearchBox autofocus={true} searchOnChange={true} queryFields={queryFields}/>
          </TopBar>
          <LayoutBody>
            <SideBar>
              <RefinementListFilter id="tag1" title="Collection" field="metadata.Collection.keyword" orderKey="_term"
                operator="AND"/>
            </SideBar>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats translations={{"hitstats.results_found": "{hitCount} results found"}}/>
                  <ViewSwitcherToggle/>
                  <SortingSelector options={[{label: "Index", key: "index", fields: [
                    {field: "metadata.Title.keyword", options: {order: "asc"}},
                      {field: "imageIndex", options: {order: "asc"}}]
                  }]}/>
                </ActionBarRow>
                <ActionBarRow>
                  <CheckboxFilter id="single-image" title="First Image" label="Select First Image" filter={TermQuery("imageIndex", '00000001')} />
                </ActionBarRow>
                <ActionBarRow>
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
              </ActionBar>
              <ViewSwitcherHits hitsPerPage={50} highlightFields={["metadata.Title"]}
                hitComponents={[
                  {key: "grid", title: "Grid", itemComponent: GridItem, defaultOption: true},
                  {key: "list", title: "List", itemComponent: ListItem}]} scrollTo="body"/>,
              <NoHits suggestionsField={"metadata.Title"}/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    )
  }
}

export default Atomic
