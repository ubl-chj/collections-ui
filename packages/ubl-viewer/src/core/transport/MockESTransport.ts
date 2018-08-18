import {ManifestTransport} from "./ManifestTransport";

export class MockESTransport extends ManifestTransport {

  get(query) {
    return Promise.resolve(query)
  }
}
