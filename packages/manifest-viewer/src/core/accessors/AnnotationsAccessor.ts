import {Accessor} from './Accessor'

export interface IAnnotationsOptions {
  scrollTo: string | boolean
}

export class AnnotationsAccessor extends Accessor {

  setResults(results) {
    super.setDocument(results)
  }
}
