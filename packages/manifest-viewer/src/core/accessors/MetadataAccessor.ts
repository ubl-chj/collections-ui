import {Accessor} from './Accessor'

export interface IMetadataOptions {
  scrollTo: string | boolean
}

export class MetadataAccessor extends Accessor {

  constructor(public options: IMetadataOptions) {
    super()
  }

  setResults(results) {
    super.setDocument(results)
  }
}
