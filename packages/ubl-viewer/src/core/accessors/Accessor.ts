import {ViewerManager} from "../ViewerManager";
const get = require("lodash/get")
const compact = require("lodash/compact")

export class Accessor {
  viewer:ViewerManager
  uuid:string
  document:any
  active:boolean
  translations:Object
  refCount:number
  constructor(){
    this.active = true
    this.translations = {}
    this.refCount = 0
  }

  incrementRef(){
    this.refCount++
  }

  decrementRef(){
    this.refCount--
  }

  setActive(active:boolean){
    this.active = active
    return this
  }

  setViewerManager(viewer){
    this.viewer = viewer
    this.uuid = viewer.guid()
    this.document = this.viewer.document
  }

  getDocument(){
    return this.document
  }

  setDocument(document){
    this.document = document
  }

}
