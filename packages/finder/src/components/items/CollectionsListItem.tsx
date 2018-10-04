import * as React from "react";
import {Link} from 'react-router-dom'
import {Hits, SearchkitManager, SearchkitProvider} from "searchkit-fork";
import {ResultContext} from "../core";
import {RefreshIcon} from "../ui/svg";
import {ItemProps} from './ItemProps'
import {RandomLandingItem} from "./RandomLandingItem";

const extend = require('lodash/extend')

export const makeValue = (value) => {
    return {__html: value}
}

export const ListCollectionEntry = (props) => {
  const {label, value} = props
  const val = makeValue(value)
  return (
    <div className='schema-list'>
      <div className='collection-list__left'>
        <span className='schema-list-key'><b>{label}</b></span>
      </div>
      <div className='schema-list-value' dangerouslySetInnerHTML={val}/>
    </div>
  )
}

export class CollectionsListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    host: process.env.REACT_APP_ELASTICSEARCH_HOST,
    options: {timeout: 20000},
    previewUrl: process.env.REACT_APP_OSD_BASE,
  }

  static randomQuery() {
    const val = (new Date()).getTime()
    return {
      function_score: {
        functions: [
          {
            random_score: {
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
        <div className='schema-list-value'>
          <SearchkitProvider searchkit={this.searchkit2}>
            <Hits hitsPerPage={1} highlightFields={["title"]} mod="sk-hits-list" itemComponent={RandomLandingItem}/>
          </SearchkitProvider>
        </div>
      )
    }
  }

  render() {
    const {result, bemBlocks} = this.props
    const source = extend({}, result._source, result.highlight)
    const index = source.index
    const queryContext = this.host + index
    this.searchkit2 = new SearchkitManager(queryContext, this.options)
    this.searchkit2.addDefaultQuery((query) => query.addQuery(CollectionsListItem.randomQuery()))
    const updated = new Date(source.dateUpdated).toDateString();
    const updatedKey = 'Last Updated'
    const totalDocsKey = 'Total Documents'
    const logo = '<img width=170 src=' + source.logo + '>'
    return (
      <ResultContext.Provider value={result}>
        <div className={bemBlocks.item().mix(bemBlocks.container('landing'))} data-qa='hit'>
          <div className={bemBlocks.item('details')}>
            <div className='schema-list-flex'>
              <div className='collection-list__left'>
                <span className='schema-list-key'><b>Collection:</b></span>
                <div dangerouslySetInnerHTML={{__html: logo}}/>
              </div>
              <div className='schema-list-value'>
                <Link to={source.route}>{source.name}</Link>
              </div>
            </div>
            <div className='schema-list'>
              <div className='collection-list__left'>
                <span className='schema-list-key'><b>Random Item:</b></span>
                <div className='JUQOte'>
                  <button className='button-transparent' onClick={this.refreshItem}><RefreshIcon/></button>
                </div>
              </div>
              {this.renderRandomItem()}
            </div>
            <ListCollectionEntry label={updatedKey} value={updated}/>
            <ListCollectionEntry label={totalDocsKey} value={source.docCount}/>
          </div>
        </div>
      </ResultContext.Provider>)
  }
}
