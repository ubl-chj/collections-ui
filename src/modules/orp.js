import React, {Component} from 'react'
import extend from 'lodash/extend'
import {Col, Container, Row} from 'reactstrap';
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

const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_ORP_INDEX;
const searchkit = new SearchkitManager(host);

const ManifestsListItem = (props) => {
    const {bemBlocks, result} = props;
    const source = extend({}, result._source, result.highlight);
    const manifestUri = process.env.REACT_APP_DYNAMO_BASE + "/dynamo?type=meta&v1=";
    const viewerIRI = process.env.REACT_APP_VIEWER_BASE + "/#?c=0&m=0&s=0&cv=0&manifest=";
    const thumbnail = source.imageServiceIRI + "/full/90,/0/default.jpg";
    const url = source.imageServiceIRI + "/full/full/0/default.jpg";
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
            <div className={bemBlocks.item("poster")}>
              <a href={url} target="_blank"><img className="thumbnail" alt="presentation" data-qa="poster" src={thumbnail}/></a>
            </div>
            <div className={bemBlocks.item("details")}>
            <Container fluid>
                <Row>
                    <Col xs="3">Image:</Col>
                    <Col xs="auto">{source.imageIndex}</Col>
                </Row>
                <Row>
                    <Col xs="auto">Collection:</Col>
                    <Col><a
                        href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag1 + "&v2=")}
                        target="_blank">{source.metadataMap.tag1}</a>
                    </Col>
                </Row>
                <Row>
                    <Col xs="3">Date Range:</Col>
                    <Col xs="auto"><a href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag2 + "&v2=")}
                            target="_blank">{source.metadataMap.tag2}</a>
                    </Col>
                </Row>
                <Row>
                    <Col xs="3">Date Begin:</Col>
                    <Col xs="auto"><a href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag3 + "&v2=")}
                            target="_blank">{source.metadataMap.tag3}</a>
                    </Col>
                </Row>
                <Row>
                    <Col xs="3"></Col>
                    <Col><a href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag4 + "&v2=")}
                            target="_blank">{source.metadataMap.tag4}</a>
                    </Col>
                </Row>
                <Row>
                    <Col xs="3"></Col>
                    <Col><a href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag5 + "&v2=")}
                            target="_blank">{source.metadataMap.tag5}</a>
                    </Col>
                </Row>
                <Row>
                    <Col xs="3"></Col>
                    <Col><a href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag6 + "&v2=")}
                            target="_blank">{source.metadataMap.tag6}</a>
                    </Col>
                </Row>
                <Row>
                    <Col xs="3"></Col>
                    <Col><a href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag7 + "&v2=")}
                            target="_blank">{source.metadataMap.tag7}</a>
                    </Col>
                </Row>
                <Row>
                    <Col xs="3"></Col>
                    <Col><a href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag8 + "&v2=")}
                            target="_blank">{source.metadataMap.tag8}</a>
                    </Col>
                </Row>
            </Container>
                <hr/>
            </div>
        </div>
    )
}

class Orp extends Component {

    render() {
        return (
            <SearchkitProvider searchkit={searchkit}>
                <Layout>
                    <TopBar>
                        <div className="my-logo">UBL</div>
                        <SearchBox autofocus={true} searchOnChange={true}
                                   queryFields={["metadataMap.tag1", "metadataMap.tag2", "metadataMap.tag3",
                                       "metadataMap.tag4", "metadataMap.tag5", "metadataMap.tag6",
                                       " metadataMap.tag7", "metadataMap.tag8"]}
                        />
                    </TopBar>
                    <LayoutBody>
                        <SideBar>
                            <RefinementListFilter id="tag1" title="Collection" field="metadataMap.tag1.keyword"
                                                  orderKey="_term" operator="AND"/>
                        </SideBar>
                        <LayoutResults>
                            <ActionBar>

                                <ActionBarRow>
                                    <HitsStats translations={{
                                        "hitstats.results_found": "{hitCount} results found"
                                    }}/>
                                    <ViewSwitcherToggle/>
                                    <SortingSelector options={[
                                        {label: "Index", field: "imageIndex", order: "asc"},
                                    ]}/>
                                </ActionBarRow>

                                <ActionBarRow>
                                    <GroupedSelectedFilters/>
                                    <ResetFilters/>
                                </ActionBarRow>

                            </ActionBar>
                            <RangeFilter field="metadataMap.tag3.raw" id="date" min={1641} max={1975}
                                         showHistogram={true} title="Date Selector"/>
                            <ViewSwitcherHits
                                hitsPerPage={12} highlightFields={["metadataMap.tag1"]}
                                sourceFilter={["tag1", "imageIndex", "metadataMap.tag1", "metadataMap.tag2",
                                    "metadataMap.tag3", "metadataMap.tag4", "metadataMap.tag5", "metadataMap.tag6",
                                    "metadataMap.tag7", "metadataMap.tag8", "imageServiceIRI"]}
                                hitComponents={[
                                    {key: "list", title: "List", itemComponent: ManifestsListItem}
                                ]}
                                scrollTo="body"
                            />
                            <NoHits suggestionsField={"metadataMap.tag1"}/>
                            <Pagination showNumbers={true}/>
                        </LayoutResults>

                    </LayoutBody>
                </Layout>
            </SearchkitProvider>
        )
    }
}

export default Orp
