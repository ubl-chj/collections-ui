import {Hits, SearchkitManager, SearchkitProvider} from 'searchkit'
import {Link} from 'react-router-dom'
import {RefreshIcon} from '../ui/svg'
import {ItemProps} from './ItemProps'
import Observer from 'react-intersection-observer'
import {RandomGridLandingItem} from './RandomGridLandingItem'
import React, {ReactElement, useEffect, useState} from 'react'
import {ResultContext} from 'collections-ui-common'
import extend from 'lodash/extend'

export const CollectionsGridItem: React.FC<ItemProps> = (props): ReactElement => {
  const host = process.env.REACT_APP_ELASTICSEARCH_HOST
  const options = {timeout: 20000, defaultSize: 1}
  const [isInitialized, setIsInitialized] = useState(false)
  const [searchkit, setSearchKit] = useState(null)
  const [refreshItem, setRefreshItem] = useState(true)
  const {result, bemBlocks} = props
  const source: any = extend({}, result._source, result.highlight)
  const index = source.index
  const queryContext = host + index
  const logo = '<img crossorigin alt="collection logo" src=' + source.logo + '>'
  const title = 'Browse ' + source.name

  const randomQuery = () => {
    const val = (new Date()).getTime()
    return {
      function_score: {
        functions: [
          {
            random_score: {
              field: '_seq_no',
              seed: val,
            },
          },
        ],
      },
    }
  }

  useEffect((): void => {
    if (!isInitialized) {
      const sk = new SearchkitManager(queryContext, options)
      sk.addDefaultQuery((query) => query.addQuery(randomQuery()))
      setSearchKit(sk)
      setIsInitialized(true)
    }
  })

  const renderRandomItem = () => {
    if (refreshItem) {
      return (
          <SearchkitProvider searchkit={searchkit}>
            <Hits hitsPerPage={1} mod="sk-hits-grid-landing" itemComponent={RandomGridLandingItem}/>
          </SearchkitProvider>
      )
    }
  }

  return searchkit ? (
    <ResultContext.Provider value={result}>
      <div className={bemBlocks.item().mix(bemBlocks.container('landing'))} data-qa='hit'>
        <div className={bemBlocks.item('details')}>
            <div className='collection-list__left'>
              <span className='schema-list-key'><b>Collection:</b></span>
              <Observer>
                {({inView, ref }) => (
                  <div ref={ref}>
                    {inView ? (
                      <Link title={title} to={source.route}>
                        <div dangerouslySetInnerHTML={{__html: logo}}/>
                      </Link>
                    ) : null}
                  </div>
                )}
              </Observer>
          </div>
            <div className='collection-list__left'>
              <span className='schema-list-key'><b>Random Item:</b></span>
              <div className='JUQOte'>
                <button
                  aria-label='refresh item'
                  title='Refresh this Item'
                  className='button-transparent'
                  onClick={() => setRefreshItem(!refreshItem)}
                >
                  <RefreshIcon/>
                </button>
              </div>
            </div>
          </div>
          {renderRandomItem()}
        </div>
    </ResultContext.Provider>) : null
}
