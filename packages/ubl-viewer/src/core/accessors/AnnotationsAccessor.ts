import {Accessor} from "./Accessor";


export interface AnnotationsOptions{
  scrollTo:string|boolean
}

export class AnnotationsAccessor extends Accessor {

  constructor(){
    super()
  }

  setResults(results){
    super.setDocument(results)
  }
}
