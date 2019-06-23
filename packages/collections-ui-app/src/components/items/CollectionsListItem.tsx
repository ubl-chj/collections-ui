import {DynamicLayoutContext, ResultContext} from 'collections-ui-common'
import {Hits, SearchkitManager, SearchkitProvider} from 'searchkit'
import {ItemProps} from './ItemProps'
import {Link} from 'react-router-dom'
import Observer from 'react-intersection-observer'
import {RandomListLandingItem} from './RandomListLandingItem'
import React, {ReactElement, useEffect, useState} from 'react'
import {RefreshIcon} from '../ui/svg'
import extend from 'lodash/extend'

export const makeValue = (value) => {
    return {__html: value}
}

export const ListCollectionEntry = (props) => {
  const {label, value} = props
  const val = makeValue(value)
  return (
    <div className='schema-list-flex'>
      <div className='collection-list__left'>
        <span className='schema-list-key'><b>{label}</b></span>
      </div>
      <div className='schema-list-value' dangerouslySetInnerHTML={val}/>
    </div>
  )
}

export const CollectionsListItem: React.FC<ItemProps> = (props): ReactElement => {
  const host = process.env.REACT_APP_ELASTICSEARCH_HOST
  const options = {timeout: 20000, defaultSize: 1}
  const [isInitialized, setIsInitialized] = useState(false)
  const [searchkit, setSearchKit] = useState(null)
  const [refreshItem, setRefreshItem] = useState(true)
  const {result, bemBlocks} = props
  const source: any = extend({}, result._source, result.highlight)
  const index = source.index
  const queryContext = host + index
  const updated = new Date(source.dateUpdated).toDateString();
  const updatedKey = 'Last Updated'
  const totalDocsKey = 'Total Documents'
  const logo = '<img crossorigin alt="collection logo" width=170 src=' + source.logo + '>'
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
        <div className='schema-list-value'>
          <SearchkitProvider
            searchkit={searchkit}>
            <Hits
              hitsPerPage={1}
              mod="sk-hits-list"
              itemComponent={RandomListLandingItem}
            />
          </SearchkitProvider>
        </div>
      )
    }
  }

  return searchkit ? (
    <ResultContext.Provider
      value={result}>
      <div className={bemBlocks.item().mix(bemBlocks.container('landing'))} data-qa='hit'>
        <div className={bemBlocks.item('details')}>
          <div className='schema-list-flex'>
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
            <div className='schema-list-value'>
              <Link title={title} to={source.route}>{source.name}</Link>
            </div>
          </div>
          <DynamicLayoutContext.Consumer>
            {(isMobile) => isMobile ?
              <div className='schema-list-flex'>
                {renderRandomItem()}
              </div> :
            <div className='schema-list-flex'>
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
              {renderRandomItem()}
            </div>}
          </DynamicLayoutContext.Consumer>
          <ListCollectionEntry
            label={updatedKey}
            value={updated}
          />
          <ListCollectionEntry
            label={totalDocsKey}
            value={source.docCount}
          />
        </div>
      </div>
    </ResultContext.Provider>) : null
}
