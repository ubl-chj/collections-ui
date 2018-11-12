import {DynamicLayoutContext, NavMenu} from 'collections-ui-common'
import * as React from 'react'
import {Link, withRouter} from 'react-router-dom'
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
} from 'searchkit-fork'
import {StandardGridItem, StandardListItem} from '../items'
import {HeadMeta} from "../schema";
import {ActionBarComponent, FilterMenu, Head} from '../ui'
import {asCollection} from './asCollection'
import {IRouteProps} from './IRouteProps'

class Collection extends React.Component<IRouteProps, any> {

  static defaultProps = {
    options: {
      timeout: 20000},
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
    width: number,
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
      searchBoxVisible: false,
      width: props.width,
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
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
  }

  buildSideBar() {
    const {routeConfig} = this.routeProps
    const {width} = this.state
    const isMobile = width <= 500
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
    const {components, width} = this.state
    const isMobile = width <= 500
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
                <Head width={width} routeConfig={routeConfig}/>
                <main>
                  <LayoutBody>
                    {this.buildSideBar()}
                    <LayoutResults>
                      <ActionBarComponent
                        width={width}
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
