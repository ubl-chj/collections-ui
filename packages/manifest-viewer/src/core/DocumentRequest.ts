import {ManifestTransport} from "./transport"
import {ViewerManager} from "./ViewerManager"
const manifesto = require('manifesto-fork')

export class DocumentRequest {

  active: boolean
  constructor(public transport: ManifestTransport,
              public documentUri: string, public viewer: ViewerManager) {
    this.active = true
  }

  run() {
    return this.transport.get(this.documentUri).then(
      this.setResults.bind(this),
    ).catch(
      this.setError.bind(this),
    )
  }

  deactivate() {
    this.active = false
  }

  setResults(document) {
    if (this.active) {
      const manifest = manifesto.create(document)
      this.viewer.setDocument(manifest)
    }
  }

  setError(error) {
    if (this.active) {
      this.viewer.setError(error)
    }
  }

}
