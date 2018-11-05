import * as React from 'react'
const manifesto = require('manifesto-fork')
import {Domain, resolveCreator} from "collections-ui-common"
import {NoHits, Pagination, SearchkitManager, SearchkitProvider} from "searchkit-fork"
import {RelatedHits} from './RelatedHits'

export class RelatedItems extends React.Component<any, any> {

  static defaultProps = {
    host: process.env.REACT_APP_ELASTICSEARCH_HOST,
    options: {timeout: 20000},
  }

  static simpleQuery(terms) {
    return {
      simple_query_string: {
        analyzer: "stop",
        default_operator: 'or',
        query: terms,
      },
    }
  }

  static multiMatchQuery(terms) {
    return {
      multi_match: {
        analyzer: "stop",
        fields: ["author^1.1", "Author^1.1", "Artist^1.1", "creators^1.1", "Creator(s)^1.1", "People^1.1", "title^0.8", "Title^0.8",
          "description^0.3"],
        query: terms,
      },
    }
  }

  host: string
  options; any
  searchkit: SearchkitManager

  constructor(props) {
    super(props)
    const host = props.host + Domain.RELATED_INDICES
    this.options = props.options
    this.searchkit = new SearchkitManager(host, this.options)
  }

  render() {
    const {document} = this.props
    if (document) {
      const manifest = manifesto.create(document)
      const title = manifesto.LanguageMap.getValue(manifest.getLabel())
      this.searchkit.addDefaultQuery((query) => query.addQuery(RelatedItems.multiMatchQuery(title)))
      return (
        <SearchkitProvider searchkit={this.searchkit}>
          <main>
            <Pagination showNumbers={true}/>
            <div style={{display: 'flex'}}>
              <RelatedHits/>
            </div>
            <NoHits/>
          </main>
        </SearchkitProvider>
      )
    }
  }
}
