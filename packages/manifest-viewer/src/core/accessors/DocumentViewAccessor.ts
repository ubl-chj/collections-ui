const head = require('lodash/head')
const find = require('lodash/find')

import {ValueState} from '../state'
import {StatefulAccessor} from './StatefulAccessor'

export class DocumentViewAccessor extends StatefulAccessor<ValueState> {
  state = new ValueState()
  options: any[]
  constructor(key, options: any[]) {
    super(key)
    this.options = options
  }

  getSelectedOption() {
    return find(this.options, {key: this.state.getValue()}) ||
      find(this.options, {defaultOption: true}) ||
      head(this.options)
  }

  setView(key) {
    const view = find(this.options, {key})
    if (view) {
      if (view.defaultOption) {
        this.state = this.state.clear()
      } else {
        this.state = this.state.setValue(view.key)
      }
      this.search()
    }
  }

  search() {
    this.viewer.getDocumentAndState()
    this.viewer.emitter.trigger()
  }
}
