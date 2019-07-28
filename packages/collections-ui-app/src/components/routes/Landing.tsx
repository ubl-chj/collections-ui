import {CircularProgress, Theme, createStyles, makeStyles, useMediaQuery} from '@material-ui/core'
import {DynamicLayoutContext, NavMenu} from 'collections-ui-common'
import React, {ReactElement, useEffect, useState} from 'react'
import {
  Layout,
  LayoutBody,
  LayoutResults,
  NoHits,
  Pagination,
  RefinementListFilter,
  SearchkitManager,
  SearchkitProvider,
  SideBar,
  ViewSwitcherHits,
} from 'searchkit'
import {CollectionsGridItem, CollectionsListItem} from '../items'
import {HeadMeta} from '../schema'
import {ActionBarComponent, Head} from '../ui'
import {IRouteProps} from './IRouteProps'

export const useMinimalResultViewerStyles = makeStyles((theme: Theme): any =>
  createStyles({
    progress: {
      margin: theme.spacing(2),
    },
  }),
)

export const Landing: React.FC<IRouteProps> = (): ReactElement => {
  const classes: any = useMinimalResultViewerStyles({})
  const routeConfig = require('./config/landing.json')
  const host = process.env.REACT_APP_ELASTICSEARCH_HOST + routeConfig.indexName
  const options = {
    timeout: 20000,
    searchUrlPath : "_search?rest_total_hits_as_int=true"
  }
  const [isInitialized, setIsInitialized] = useState(false)
  const [searchkit, setSearchKit] = useState(null)
  const matches = useMediaQuery('(max-width:600px)')

  useEffect((): void => {
    if (!isInitialized) {
      setSearchKit(new SearchkitManager(host, options))
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
            id='tag1'
            title='Collection'
            field='name.keyword'
            orderKey='_term'
            operator='AND'/>
        </SideBar>)
    }
  }

  const gridObj = {
    defaultOption: true,
    itemComponent: CollectionsGridItem,
    key: 'grid',
    title: 'Grid',
  }
  const listObj = {
    itemComponent: CollectionsListItem,
    key: 'list',
    title: 'List',
  }
  return searchkit ? (
    <SearchkitProvider
      searchkit={searchkit}>
      <div
        style={{background: '#efefef'}}
        id='outer'>
        <HeadMeta/>
        <NavMenu/>
        <div id='inner'>
          <Layout>
            <Head
              routeConfig={routeConfig}/>
            <main>
              <LayoutBody>
                {buildSideBar()}
                <LayoutResults>
                  <ActionBarComponent
                    isMobile={matches}
                    routeConfig={routeConfig}/>
                  <DynamicLayoutContext.Provider
                    value={matches}>
                    <ViewSwitcherHits
                      hitsPerPage={50}
                      highlightFields={routeConfig.highlightFields}
                      hitComponents={[listObj, gridObj]}
                      scrollTo='body'
                    />
                  </DynamicLayoutContext.Provider>
                  <NoHits
                    suggestionsField={'name'}
                  />
                  <Pagination
                    showNumbers={true}
                  />
                </LayoutResults>
              </LayoutBody>
            </main>
          </Layout>
        </div>
      </div>
    </SearchkitProvider>
  ) : <CircularProgress className={classes.progress}/>
}
