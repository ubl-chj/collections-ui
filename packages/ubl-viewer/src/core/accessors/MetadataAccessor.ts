import {Accessor} from "./Accessor";
import {AnnotationsOptions} from "./AnnotationsAccessor";

export interface MetadataOptions{
  scrollTo:string|boolean
}

export class MetadataAccessor extends Accessor {

  constructor(public options:MetadataOptions){
    super()
  }

  setResults(results){
    super.setDocument(results)
  }
}
