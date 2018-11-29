import {Accessor, StatefulAccessor} from './accessors'
import {Utils} from './support'

const filter = require('lodash/filter')
const values = require('lodash/values')
const reduce = require('lodash/reduce')
const assign = require('lodash/assign')
const each = require('lodash/each')
const without = require('lodash/without')
const find = require('lodash/find')

type StatefulAccessors = Array<StatefulAccessor<any>>

export class AccessorManager {

  accessors: Accessor[]
  statefulAccessors: {}

  constructor() {
    this.accessors = []
    this.statefulAccessors = {}
  }

  getAccessors() {
    return this.accessors
  }

  getActiveAccessors() {
    return filter(this.accessors, {active: true})
  }

  getStatefulAccessors() {
    return values(this.statefulAccessors) as StatefulAccessors
  }

  getAccessorsByType(type) {
    return filter(this.accessors, Utils.instanceOf(type))
  }

  getAccessorByType(type) {
    return find(this.accessors, Utils.instanceOf(type))
  }

  add(accessor) {
    if (accessor instanceof StatefulAccessor) {
      const existingAccessor = this.statefulAccessors[accessor.key]
      if (existingAccessor) {
        if (existingAccessor.constructor === accessor.constructor) {
          existingAccessor.incrementRef()
          return existingAccessor
        } else {
          throw new Error(`Multiple imcompatible components with id='${accessor.key}' existing on the page`)
        }

      } else {
        this.statefulAccessors[accessor.key] = accessor
      }
    }
    accessor.incrementRef()
    this.accessors.push(accessor)
    return accessor
  }

  remove(accessor) {
    if (!accessor) {
      return
    }
    accessor.decrementRef()
    if (accessor.refCount === 0) {
      if (accessor instanceof StatefulAccessor) {
        delete this.statefulAccessors[accessor.key]
      }
      this.accessors = without(this.accessors, accessor)
    }
  }

  getState() {
    return reduce(this.getStatefulAccessors(), (state, accessor) => {
      return assign(state, accessor.getQueryObject())
    }, {})
  }

  setState(state) {
    each(
      this.getStatefulAccessors(),
      (accessor) => accessor.fromQueryObject(state),
    )
  }

  notifyStateChange(oldState) {
    each(
      this.getStatefulAccessors(),
      (accessor) => accessor.onStateChange(oldState),
    )
  }

  setResults(results) {
    each(this.accessors, (a) => a.setResults(results))
  }

  resetState() {
    each(this.getStatefulAccessors(), (a) => a.resetState())
  }

}
