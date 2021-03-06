import {DynamicLayoutContext, NavMenu} from 'collections-ui-common'
import React from 'react'
import {
  ItemList,
  Layout,
  LayoutBody,
  LayoutResults,
  NoHits,
  Pagination,
  Panel,
  RangeFilter,
  RefinementListFilter,
  SearchkitManager,
  SearchkitProvider,
  SideBar,
  ViewSwitcherHits,
} from 'searchkit'
import {StandardGridItem, StandardListItem} from '../items'
import {HeadMeta} from '../schema'
import {ActionBarComponent, Head} from '../ui'
import {asCollection} from './asCollection'
import {IRouteProps} from './IRouteProps'

class Collection extends React.Component<IRouteProps, any> {

  static defaultProps = {
    options: {
      timeout: 20000,
      searchUrlPath : "_search?rest_total_hits_as_int=true"
    },
  }

  static buildHitComponents(gridItem, listItem, listDefault) {
    const gridObj = {
      itemComponent: gridItem,
      key: 'grid',
      title: 'Grid',
    }
    const listObj = {
      itemComponent: listItem,
      key: 'list',
      title: 'List',
    }
    if (listDefault) {
      Object.defineProperty(listObj, 'defaultOption', {value: true});
    } else {
      Object.defineProperty(gridObj, 'defaultOption', {value: true});
    }
    return [gridObj, listObj]
  }

  state: {
    components: [any, any],
    filterMenuVisible: boolean,
    searchBoxVisible: boolean,
    isMobile: boolean,
  }
  searchkit: SearchkitManager
  cachedHits: any
  routeKey: string
  routeProps: IRouteProps
  dataLayer: object

  constructor(props) {
    super(props);
    this.state = {
      components: [StandardGridItem, StandardListItem],
      filterMenuVisible: false,
      isMobile: props.isMobile,
      searchBoxVisible: false,
    }
    this.routeProps = props.config
    this.routeKey = props.config.routeConfig.indexName
    const host = process.env.REACT_APP_ELASTICSEARCH_HOST + this.routeKey
    this.searchkit = new SearchkitManager(host, props.options)
  }

  addComponent = async (type) => {
    import(`../items/${type}`)
      .then((component) =>
        this.setState({
          components: this.state.components.concat(component.default),
        }),
      )
      .catch((error) => {
        console.log(error);
      })
  }

  componentDidMount() {
    const {items} = this.props
    items.map((type) => this.addComponent(type))
  }

  componentDidUpdate(prevProps) {
    this.dataLayer = (window as any).schemaDataLayer ? (window as any).schemaDataLayer : null
    if (this.props.isMobile !== prevProps.isMobile) {
      this.setState({isMobile: this.props.isMobile})
    }
  }

  buildSideBar() {
    const {routeConfig} = this.routeProps
    const {isMobile} = this.state
    if (isMobile) {
      return null
    } else {
      return (
        <SideBar>
          <RefinementListFilter
            containerComponent={<Panel collapsable={true} defaultCollapsed={false}/>}
            field={routeConfig.refinementListFilterDef1.field}
            title={routeConfig.refinementListFilterDef1.title}
            id={routeConfig.refinementListFilterDef1.id}
            operator='AND'
            listComponent={ItemList}
          />
          <RefinementListFilter
            containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
            field={routeConfig.refinementListFilterDef2.field}
            title={routeConfig.refinementListFilterDef2.title}
            id={routeConfig.refinementListFilterDef2.id}
            operator='AND'
            listComponent={ItemList}
          />
          <RefinementListFilter
            containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
            field={routeConfig.refinementListFilterDef3.field}
            title={routeConfig.refinementListFilterDef3.title}
            id={routeConfig.refinementListFilterDef3.id}
            operator='AND'
            listComponent={ItemList}
          />
        </SideBar>
      )
   }
  }

  render() {
    const {routeConfig} = this.routeProps
    const {components, isMobile} = this.state
    if (components.length >= 2 && components[0] !== 'undefined') {
      const gridItem = components[0]
      const listItem = components[1]
      return (
        <SearchkitProvider searchkit={this.searchkit}>
          <div style={{background: '#efefef'}} id='outer'>
            <HeadMeta/>
            <NavMenu/>
            <div id='inner'>
              <Layout>
                <Head isMobile={isMobile} routeConfig={routeConfig}/>
                <main>
                  <LayoutBody>
                    {this.buildSideBar()}
                    <LayoutResults>
                      <ActionBarComponent
                        isMobile={isMobile}
                        routeConfig={routeConfig}
                      />
                      {routeConfig.hasRangeFilter ?
                        <div className='ex1'>
                          <RangeFilter
                            field={routeConfig.rangeFilter.field}
                            id={routeConfig.rangeFilter.id}
                            min={routeConfig.rangeFilter.min}
                            max={routeConfig.rangeFilter.max}
                            showHistogram={true}
                            title='Date Selector'
                          />
                        </div> : null
                      }
                      <Pagination showNumbers={true}/>
                      <DynamicLayoutContext.Provider value={isMobile}>
                        <ViewSwitcherHits
                          hitsPerPage={50}
                          highlightFields={routeConfig.highlightFields}
                          hitComponents={Collection.buildHitComponents(gridItem, listItem, routeConfig.listDefault)}
                          scrollTo='body'
                        />
                      </DynamicLayoutContext.Provider>
                      <NoHits suggestionsField={routeConfig.suggestionField}/>
                      <Pagination showNumbers={true}/>
                    </LayoutResults>
                  </LayoutBody>
                </main>
              </Layout>
            </div>
          </div>
        </SearchkitProvider>)
    } else {
      return null
    }
  }
}

export default asCollection(Collection)
