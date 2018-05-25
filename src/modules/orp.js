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

const host = "http://localhost:9100/vp3";
const searchkit = new SearchkitManager(host);

const ManifestsListItem = (props) => {
    const baseURI = "http://workspaces.ub.uni-leipzig.de";
    const {bemBlocks, result} = props;
    const source = extend({}, result._source, result.highlight);
    const manifestUri = baseURI + ":9095/dynamo?type=meta&v1=";
    const viewerIRI = baseURI + ":9001/#?c=0&m=0&s=0&cv=0&manifest=";
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
            <div className={bemBlocks.item("poster")}>
                <img alt="presentation" data-qa="poster" src={source.imageServiceIRI + "/full/90,/0/default.jpg"}/>
            </div>
            <div className={bemBlocks.item("details")}>
                <a href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag1 + "&v2=")}
                   target="_blank">
                    <h2 className={bemBlocks.item("subtitle")}
                        dangerouslySetInnerHTML={{__html: source.metadataMap.tag1}}></h2></a>
                <a href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag2 + "&v2=")}
                   target="_blank">
                    <h2 className={bemBlocks.item("subtitle")}
                        dangerouslySetInnerHTML={{__html: source.metadataMap.tag2}}></h2></a>
                <a href={viewerIRI + encodeURIComponent(manifestUri + source.metadataMap.tag3 + "&v2=")}
                   target="_blank">
                    <h2 className={bemBlocks.item("subtitle")}
                        dangerouslySetInnerHTML={{__html: source.metadataMap.tag3}}></h2></a>
            </div>
        </div>
    )
};

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
                                       " metadataMap.tag7"]}
                        />
                    </TopBar>
                    <LayoutBody>
                        <SideBar>
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
                            <ViewSwitcherHits
                                hitsPerPage={12} highlightFields={["metadataMap.tag1"]}
                                sourceFilter={["imageIndex","metadataMap.tag1","metadataMap.tag2",
                                    "metadataMap.tag3","metadataMap.tag4","metadataMap.tag5","metadataMap.tag6",
                                    "metadataMap.tag7","imageServiceIRI"]}
                                hitComponents={[
                                    {key: "list", title: "List", itemComponent: ManifestsListItem }
                                ]}
                                scrollTo="body"
                            />
                            <NoHits suggestionsField={"metadataMap.tag1"}/>
                            <Pagination showNumbers={true}/>
                        </LayoutResults>

                    </LayoutBody>
                </Layout>
            </SearchkitProvider>
        );
    }
}

export default Orp;
