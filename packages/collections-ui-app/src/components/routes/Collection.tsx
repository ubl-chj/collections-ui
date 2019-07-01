import {DynamicLayoutContext, NavMenu} from 'collections-ui-common'
import React, {ReactElement, useEffect, useState} from 'react'
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
import {CircularProgress, Theme, createStyles, makeStyles, useMediaQuery} from '@material-ui/core'

const buildHitComponents = (gridItem, listItem, listDefault) => {
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

export const useCollectionStyles = makeStyles((theme: Theme): any =>
  createStyles({
    progress: {
      margin: theme.spacing(2),
    },
  }),
)

export const Collection: React.FC<any> = (props): ReactElement => {
  const options = {timeout: 20000}
  const classes: any = useCollectionStyles({})
  const [isInitialized, setIsInitialized] = useState(false)
  const [searchkit, setSearchKit] = useState(null)
  const [components, setComponents] = useState([StandardGridItem, StandardListItem])
  const routeProps = props.config
  const routeKey = props.config.routeConfig.indexName
  const host = process.env.REACT_APP_ELASTICSEARCH_HOST + routeKey
  const matches = useMediaQuery('(max-width:600px)')

  const addComponent = async (type) => {
    import(`../items/${type}`)
      .then((component) =>
          setComponents(components.concat(component.default))
      )
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect((): void => {
    if (!isInitialized) {
      setSearchKit(new SearchkitManager(host, options))
      const {items} = props
      items.map((type) => addComponent(type))
      setIsInitialized(true)
    }
  })

  const buildSideBar = () => {
    if (matches) {
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


  const dataLayer = (window as any).schemaDataLayer ? (window as any).schemaDataLayer : null
  const {routeConfig} = routeProps
  const gridItem = components[0]
  const listItem = components[1]
  return components && searchkit ?
    (
      <SearchkitProvider searchkit={searchkit}>
        <div style={{background: '#efefef'}} id='outer'>
          <HeadMeta/>
          <NavMenu/>
          <div id='inner'>
            <Layout>
              <Head isMobile={matches} routeConfig={routeConfig}/>
              <main>
                <LayoutBody>
                  {buildSideBar()}
                  <LayoutResults>
                    <ActionBarComponent
                      isMobile={matches}
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
                    <DynamicLayoutContext.Provider value={matches}>
                      <ViewSwitcherHits
                        hitsPerPage={50}
                        highlightFields={routeConfig.highlightFields}
                        hitComponents={buildHitComponents(gridItem, listItem, routeConfig.listDefault)}
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
      </SearchkitProvider>
    ) : <CircularProgress className={classes.progress}/>
}

export default asCollection(Collection)
