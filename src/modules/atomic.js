import React, {Component} from 'react'
import extend from 'lodash/extend'
import '../env'
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

const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_ATOMIC_INDEX
const searchkit = new SearchkitManager(host)
const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
const osdUrl = process.env.REACT_APP_OSD_BASE
const viewerUrl = process.env.REACT_APP_UBL_IMAGE_VIEWER_BASE
const queryFields = ["iiifService", "structureMap.1.@id", "structureMap.1.label", "metadata.Date",
  "metadata.Title", "metadata.Author", "metadata.Date of publication", "metadata.Call number", "metadata.Collection",
  "metadata.Objekttitel", "metadata.Part of", "metadata.Place", "metadata.Place of publication", "metadata.Publisher",
  "metadata.Sprache", "metadata.URN", "metadata.Source PPN (SWB)"]
const constManifestUrl = generatorUrl + "?type=atomic&index="+ process.env.REACT_APP_ATOMIC_INDEX+ "&q="

const ManifestHitsGridItem = (props) => {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = source.iiifService + "/full/pct:25/0/default.jpg"
  const url = osdUrl + "?image=" + source.iiifService
  const pathname = new URL(source.iiifService).pathname
  const splitPath = pathname.split("/")
  const viewId = splitPath[5]
  const viewer = viewerUrl + viewId
  const titleString = source.metadata.Title.substr(0, 50) + "... : " + source.imageIndex
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <a href={url} target="_blank"><img className={bemBlocks.item("poster")} alt="presentation" data-qa="poster"
          src={thumbnail} width="140"/></a>
      </div>
      <a href={viewer} target="_blank">
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html: titleString}}/>
      </a>
  </div>
  )
}

const ManifestsListItem = (props) => {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = source.iiifService + "/full/90,/0/default.jpg"
  const url = osdUrl + "?image=" + source.iiifService
  const pathname = new URL(source.iiifService).pathname
  const splitPath = pathname.split("/")
  const viewId = splitPath[5]
  const viewer = viewerUrl + viewId
  const query = "{\"query\":{\"multi_match\":{\"query\":\"" + viewId + "\",\"type\":\"cross_fields\",\"operator\":\"and\"}},\"size\":500}"

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <a href={url} target="_blank"><img className="thumbnail" alt="presentation" data-qa="poster" src={thumbnail}/></a>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={viewer} target="_blank">
          <h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html: source.metadata.Title}}/></a>
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
            <td>Composite Manifest:</td>
            <td><a href={constManifestUrl + query} target="_blank">{viewId}</a></td>
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
                  {key: "grid", title: "Grid", itemComponent: ManifestHitsGridItem, defaultOption: true},
                  {key: "list", title: "List", itemComponent: ManifestsListItem}]} scrollTo="body"/>
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
