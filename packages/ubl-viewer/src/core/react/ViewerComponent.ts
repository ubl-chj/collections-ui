import * as React from "react"
import * as PropTypes from "prop-types"
import {ViewerManager} from "../ViewerManager"
const mapValues = require("lodash/mapValues")
import {block} from "./block"
import {Accessor} from "../accessors";

export interface ViewerComponentProps {
  mod?:string
  className?:string
  translations?:Object
  viewer?:ViewerManager
  key?:string
  viewerComponents?:Array<Object>
}

export class ViewerComponent<P extends ViewerComponentProps,S> extends React.Component<P,S> {
  accessor: Accessor
  viewer:ViewerManager
  stateListenerUnsubscribe:Function
  translations:Object = {}
  unmounted = false

  static contextTypes: React.ValidationMap<any> = {
    viewer:PropTypes.instanceOf(ViewerManager)
  }

  static translationsPropType = (translations)=> {
    return PropTypes.shape(mapValues(translations, ()=> PropTypes.string))
  }

  static propTypes:any = {
    mod :PropTypes.string,
    className :PropTypes.string,
    translations: PropTypes.objectOf(
      PropTypes.string),
    viewer:PropTypes.instanceOf(ViewerManager)
  }

  constructor(props?){
    super(props)
  }

  static defineBEMBlocks() {
    return null;
  }

  defineAccessor():Accessor{
    return null
  }

  get bemBlocks(): any {
    return mapValues(ViewerComponent.defineBEMBlocks(), (cssClass) => {
      return block(cssClass).el
    })
  }
  _getViewer(){
    return this.props.viewer || this.context["viewer"]
  }
  componentWillMount(){
    var _this = this;
    this.viewer = this._getViewer()
    if(this.viewer){
      this.accessor  = this.defineAccessor()
      if(this.accessor){
        this.accessor = this.viewer.addAccessor(this.accessor)
      }
      this.stateListenerUnsubscribe = this.viewer.emitter.addListener(function () {
        if (!_this.unmounted) {
          _this.forceUpdate();
        }
      });
    } else {
      console.warn("No viewer found in props or context for " + this.constructor["name"])
    }
  }

  componentWillUnmount(){
    if(this.stateListenerUnsubscribe){
      this.stateListenerUnsubscribe()
    }
    if(this.viewer && this.accessor){
      this.viewer.removeAccessor(this.accessor)
    }
    this.unmounted = true
  }

  getDocument(){
    return this.viewer.document
  }

  isInitialLoading(){
    return this.viewer.initialLoading
  }

  isLoading(){
    return this.viewer.loading
  }

  getError(){
    return this.viewer.error
  }
}
