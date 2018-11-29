import {State} from '../state'
import {Accessor} from './Accessor'

export class StatefulAccessor<T extends State<any>> extends Accessor {
  key: string
  urlKey: string
  state: T
  resultsState: T

  constructor(key, urlString?) {
    super()
    this.key = key
    this.urlKey = urlString || key && key.replace(/\./g, '_')
  }

  fromQueryObject(ob) {
    const value = ob[this.urlKey]
    this.state = this.state.setValue(value)
  }

  getQueryObject() {
    const val = this.state.getValue()
    return (val) ? {
      [this.urlKey]: val,
    } : {}
  }

  setViewerManager(searchkit) {
    super.setViewerManager(searchkit)
    this.uuid = this.key + this.uuid
    this.fromQueryObject(searchkit.state)
    this.setResultsState()
  }

  setResults(results) {
    super.setDocument(results)
    this.setResultsState()
  }

  setResultsState() {
    this.resultsState = this.state
  }

  resetState() {
    this.state = this.state.clear()
  }
}
