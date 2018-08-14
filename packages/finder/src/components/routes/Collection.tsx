import * as React from 'react'
import {Link} from 'react-router-dom'
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
  Panel,
  RangeFilter,
  RefinementListFilter,
  ResetFilters,
  SearchBox,
  SearchkitManager,
  SearchkitProvider,
  SideBar,
  SortingSelector,
  TagCloud,
  TopBar,
  ViewSwitcherHits,
  ViewSwitcherToggle
} from 'searchkit-fork'
import {AuthUserProfile, AuthUserTooltip} from '../ui'
import {CollectionContext} from '../core'
import {Domain, Routes} from '../../constants'
import '../../assets/index.css'
import {asCollection} from "./asCollection";

const ReactTooltip = require('react-tooltip')

class Collection extends React.Component {
  state: { components: [] }
  props: any;
  searchkit: SearchkitManager

  addComponent = async type => {
    import(`../items/${type}` )
      .then(component =>
        this.setState({
          components: this.state.components.concat(component.default)
        })
      )
      .catch(error => {
        console.log(error);
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      components: []
    }
  }

  getSearchkit = (config) => {
    const host = process.env.REACT_APP_ELASTICSEARCH_HOST + config.routeConfig.indexName
    const options = {
      timeout: 20000
    }
    return new SearchkitManager(host, options)
  }

  async componentDidMount() {
    const {items} = this.props
    items.map(async type => await this.addComponent(type));
  }

  render() {
    const {components} = this.state;
    if (components.length >= 2) {
      function gridItem() {
        return components[0]
      }

      function listItem() {
        return components[1]
      }

      const t = Boolean(true)
      return (
        <CollectionContext.Consumer>
          {(config) =>
            <SearchkitProvider searchkit={this.getSearchkit(config)}>
              <Layout>
                <TopBar>
                  <div className='my-logo'>
                    <Link className='my-logo' to={Routes.LANDING}>{Domain.LOGO_TEXT}</Link>
                  </div>
                  <SearchBox autofocus={true} searchOnChange={true} queryFields={config.routeConfig.queryFields}/>
                  <div data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
                    <AuthUserProfile/>
                  </div>
                  <ReactTooltip id='authUserProfile' offset={{left: 170}} globalEventOff='click' border={t} place='bottom' type='light'
                    effect='solid'>
                    <AuthUserTooltip/>
                  </ReactTooltip>
                </TopBar>
                <LayoutBody>
                  <SideBar>
                    <RefinementListFilter containerComponent={<Panel collapsable={true} defaultCollapsed={false}/>}
                      field={config.routeConfig.refinementListFilterDef1.field} title={config.routeConfig.refinementListFilterDef1.title}
                      id={config.routeConfig.refinementListFilterDef1.id} listComponent={TagCloud}/>
                    <RefinementListFilter containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
                      field={config.routeConfig.refinementListFilterDef2.field} title={config.routeConfig.refinementListFilterDef2.title}
                      id={config.routeConfig.refinementListFilterDef2.id} orderKey='_term' operator='AND' listComponent={TagCloud}/>
                    <RefinementListFilter containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
                      field={config.routeConfig.refinementListFilterDef3.field} title={config.routeConfig.refinementListFilterDef3.title}
                      id={config.routeConfig.refinementListFilterDef3.id} orderKey='_term' operator='AND' listComponent={TagCloud}/>
                  </SideBar>
                  <LayoutResults>
                    <ActionBar>
                      <ActionBarRow>
                        <HitsStats translations={{'hitstats.results_found': '{hitCount} results found'}}/>
                        <ViewSwitcherToggle/>
                        <SortingSelector options={config.routeConfig.sortingSelectorOptions}/>
                      </ActionBarRow>
                      <ActionBarRow>
                        <GroupedSelectedFilters/>
                        <ResetFilters/>
                      </ActionBarRow>
                    </ActionBar>
                    {config.routeConfig.hasRangeFilter ?
                      <div className='ex1'>
                        <RangeFilter field={config.routeConfig.rangeFilter.field} id={config.routeConfig.rangeFilter.id}
                          min={config.routeConfig.rangeFilter.min} max={config.routeConfig.rangeFilter.max} showHistogram={true}
                          title='Date Selector'/>
                      </div> : null
                    }
                    <ViewSwitcherHits hitsPerPage={50} highlightFields={config.routeConfig.highlightFields} hitComponents={[
                      {
                        key: 'grid',
                        title: 'Grid',
                        itemComponent: gridItem(),
                        defaultOption: true
                      },
                      {
                        key: 'list',
                        title: 'List',
                        itemComponent: listItem()
                      }
                    ]} scrollTo='body'/>
                    <NoHits suggestionsField={config.routeConfig.suggestionField}/>
                    <Pagination showNumbers={true}/>
                  </LayoutResults>
                </LayoutBody>
              </Layout>
            </SearchkitProvider>
          }
        </CollectionContext.Consumer>
      )
    } else {
      return null
    }
  }
}

export default asCollection(Collection)
