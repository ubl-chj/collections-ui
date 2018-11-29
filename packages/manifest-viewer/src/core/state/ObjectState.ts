import {State} from './State'

const isEmpty = require('lodash/isEmpty')

export class ObjectState extends State<object> {

  getValue() {
    return this.value || {}
  }

  hasValue() {
    return !isEmpty(this.value)
  }
}
