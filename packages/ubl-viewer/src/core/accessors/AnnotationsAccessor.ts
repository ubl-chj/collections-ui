import {Accessor} from "./Accessor";


export interface AnnotationsOptions{
  scrollTo:string|boolean
}

export class AnnotationsAccessor extends Accessor {

  constructor(public options:AnnotationsOptions){
    super()
  }

  setResults(results){
    super.setDocument(results)
  }

  getScrollSelector(){
    return (this.options.scrollTo == true) ?
      "body" :
      this.options.scrollTo.toString();
  }
}
