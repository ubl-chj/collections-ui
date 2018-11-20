import {ResultContext} from 'collections-ui-common'
import * as React from "react"
import Observer from 'react-intersection-observer'
import {Link} from 'react-router-dom'
import {Hits, SearchkitManager, SearchkitProvider} from "searchkit-fork"
import {RefreshIcon} from "../ui/svg"
import {ItemProps} from './ItemProps'
import {RandomGridLandingItem} from "./RandomGridLandingItem"

const extend = require('lodash/extend')

export class CollectionsGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    host: process.env.REACT_APP_ELASTICSEARCH_HOST,
    options: {timeout: 20000, defaultSize: 1},
  }

  static randomQuery() {
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
  host: string
  options; any
  searchkit2: SearchkitManager
  state: {
    refreshItem: boolean,
  }

  constructor(props) {
    super(props)
    this.host = props.host
    this.options = props.options
    this.state = {
      refreshItem: false,
    }
  }

  refreshItem = () => this.setState({refreshItem: !this.state.refreshItem})

  componentDidMount() {
    this.setState({refreshItem: true})
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchkit2 !== prevProps.searchkit2) {
      this.setState({refreshItem: true})
    }
  }

  renderRandomItem() {
    if (this.state.refreshItem) {
      return (
          <SearchkitProvider searchkit={this.searchkit2}>
            <Hits hitsPerPage={1} mod="sk-hits-grid-landing" itemComponent={RandomGridLandingItem}/>
          </SearchkitProvider>
      )
    }
  }

  render() {
    const {result, bemBlocks} = this.props
    const source = extend({}, result._source, result.highlight)
    const index = source.index
    const queryContext = this.host + index
    this.searchkit2 = new SearchkitManager(queryContext, this.options)
    this.searchkit2.addDefaultQuery((query) => query.addQuery(CollectionsGridItem.randomQuery()))
    const logo = '<img crossorigin alt="collection logo" src=' + source.logo + '>'
    const title = 'Browse ' + source.name
    return (
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
                    onClick={this.refreshItem}
                  >
                    <RefreshIcon/>
                  </button>
                </div>
              </div>
            </div>
            {this.renderRandomItem()}
          </div>
      </ResultContext.Provider>)
  }
}
