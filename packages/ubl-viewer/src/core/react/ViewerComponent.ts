import * as PropTypes from "prop-types"
import * as React from "react"
import {ViewerManager} from "../ViewerManager"
const mapValues = require("lodash/mapValues")
import {Accessor} from "../accessors";
import {block} from "./block"

export interface IViewerComponentProps {
  mod?: string
  className?: string
  translations?: object
  viewer?: ViewerManager
  key?: string
  viewerComponents?: object[]
}

export class ViewerComponent<P extends IViewerComponentProps, S> extends React.Component<P, S> {

  get bemBlocks(): any {
    return mapValues(ViewerComponent.defineBEMBlocks(), (cssClass) => {
      return block(cssClass).el
    })
  }

  static contextTypes: React.ValidationMap<any> = {
    viewer: PropTypes.instanceOf(ViewerManager),
  }

  static propTypes: any = {
    className : PropTypes.string,
    mod : PropTypes.string,
    translations: PropTypes.objectOf(
      PropTypes.string),
    viewer: PropTypes.instanceOf(ViewerManager),
  }

  static translationsPropType = (translations) => {
    return PropTypes.shape(mapValues(translations, () => PropTypes.string))
  }

  static defineBEMBlocks() {
    return null;
  }
  accessor: Accessor
  viewer: ViewerManager
  stateListenerUnsubscribe: Function
  translations: object = {}
  unmounted = false

  constructor(props?) {
    super(props)
  }

  defineAccessor(): Accessor {
    return null
  }
  _getViewer() {
    return this.props.viewer || this.context.viewer
  }
  componentWillMount() {
    const self = this;
    this.viewer = this._getViewer()
    if (this.viewer) {
      this.accessor  = this.defineAccessor()
      if (this.accessor) {
        this.accessor = this.viewer.addAccessor(this.accessor)
      }
      this.stateListenerUnsubscribe = this.viewer.emitter.addListener(() => {
        if (!self.unmounted) {
          self.forceUpdate();
        }
      });
    } else {
      console.warn("No viewer found in props or context for " + this.constructor.name)
    }
  }

  componentWillUnmount() {
    if (this.stateListenerUnsubscribe) {
      this.stateListenerUnsubscribe()
    }
    if (this.viewer && this.accessor) {
      this.viewer.removeAccessor(this.accessor)
    }
    this.unmounted = true
  }

  getDocument() {
    return this.viewer.document
  }

  isInitialLoading() {
    return this.viewer.initialLoading
  }

  isLoading() {
    return this.viewer.loading
  }

  getError() {
    return this.viewer.error
  }
}
