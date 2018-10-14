import {AccessorManager} from "./AccessorManager";
import {DocumentRequest} from "./DocumentRequest"
import {EventEmitter, GuidGenerator} from "./support";
import {AxiosManifestTransport, ManifestTransport} from "./transport";
import {VERSION} from "./ViewerVersion"

const defaults = require("lodash/defaults")

export interface IViewerOptions {
  useHistory?: boolean
  createHistory?: Function
  getLocation?: Function
  searchOnLoad?: boolean
  httpHeaders?: object
  basicAuth?: string
  transport?: ManifestTransport
  searchUrlPath?: string
  timeout?: number
  withCredentials?: boolean
  defaultSize?: number
}

export interface InitialState {
  document?: object,
  state?: object
}

export class ViewerManager {
  static VERSION = VERSION
  accessors: AccessorManager
  documentUri: string
  document: any
  emitter: EventEmitter
  documentEmitter: EventEmitter
  completeRegistration: Function
  guidGenerator: GuidGenerator
  state: any
  transport: ManifestTransport
  currentDocumentRequest: DocumentRequest
  options: IViewerOptions
  error: any
  loading: boolean
  initialLoading: boolean
  VERSION = VERSION
  private registrationCompleted: Promise<any>

  constructor(documentUri: string, options: IViewerOptions = {}, initialState: InitialState = {}) {
    this.options = defaults(options, {
      defaultSize: 20,
      getLocation: () => typeof window !== 'undefined' && window.location,
      httpHeaders: {},
    })
    this.documentUri = documentUri
    this.document = initialState.document
    this.emitter = new EventEmitter()
    this.documentEmitter = new EventEmitter()
    this.guidGenerator = new GuidGenerator()
    this.state = initialState.state || {}
    this.transport = new AxiosManifestTransport(documentUri, {
      basicAuth: this.options.basicAuth,
      headers: this.options.httpHeaders,
      searchUrlPath: this.options.searchUrlPath,
      timeout: this.options.timeout,
      withCredentials: this.options.withCredentials,
    })
    this.registrationCompleted = new Promise((resolve) => {
      this.completeRegistration = resolve
    })
    this.accessors = new AccessorManager()
  }

  guid(prefix) {
    return this.guidGenerator.guid(prefix)
  }

  setupListeners() {
    this.getRemoteManifest()
  }

  addAccessor(accessor) {
    accessor.setViewerManager(this)
    return this.accessors.add(accessor)
  }

  removeAccessor(accessor) {
    this.accessors.remove(accessor)
  }

  getRemoteManifest() {
    this.registrationCompleted.then(() => {
      this._get()
    }).catch((e) => {
      console.error(e.stack)
    })
  }

  getDocumentAndState() {
    return {
      document: this.document,
      state: this.state,
    }
  }

  _get() {
    this.state = this.accessors.getState()
    if (this.document) {
      return Promise.resolve(this.getDocumentAndState())
    }
    this.loading = true
    this.emitter.trigger()
    this.currentDocumentRequest = new DocumentRequest(
      this.transport, this.documentUri, this)
    return this.currentDocumentRequest.run()
      .then(() => {
        return this.getDocumentAndState()
      })
  }

  setDocument(document) {
    this.document = document
    this.accessors.setResults(document)
    this.onResponseChange()
    this.documentEmitter.trigger(this.document)
  }

  setError(error) {
    this.error = error
    console.error(this.error)
    this.document = null
   }

  onResponseChange() {
    this.loading = false
    this.initialLoading = false
    this.emitter.trigger()
  }

}
