import {ManifestTransport} from "./transport"
import {ViewerManager} from "./ViewerManager";

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
      this.viewer.setDocument(document)
    }
  }

  setError(error) {
    if (this.active) {
      this.viewer.setError(error)
    }
  }

}
