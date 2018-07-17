const head = require("lodash/head")
const find = require("lodash/find")


import {StatefulAccessor} from "./StatefulAccessor"
import {ValueState} from "../state"

export class DocumentViewAccessor extends StatefulAccessor<ValueState>{
  state = new ValueState()
  options:Array<any>
  constructor(key, options:Array<any>){
    super(key)
    this.options = options
  }

  getSelectedOption(){
    return find(this.options, {key:this.state.getValue()}) ||
      find(this.options, {defaultOption:true}) ||
      head(this.options)
  }

  setView(key){
    let view = find(this.options, {key})
    if(view) {
      if(view.defaultOption){
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
