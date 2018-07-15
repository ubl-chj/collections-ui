import {VERSION} from "./ViewerVersion"
import {DocumentRequest} from "./DocumentRequest"
import {AxiosManifestTransport, ManifestTransport} from "./transport";

const defaults = require("lodash/defaults")

export interface ViewerOptions {
  useHistory?: boolean
  createHistory?: Function
  getLocation?: Function
  searchOnLoad?: boolean
  httpHeaders?: Object
  basicAuth?: string
  searchUrlPath?: string
  timeout?: number
  withCredentials?: boolean
  defaultSize?: number
}

export interface InitialState {
  document?:Object,
  state?: Object
}

export class ViewerManager {
  documentUri: string
  document:any
  state:any
  transport:ManifestTransport
  currentDocumentRequest:DocumentRequest
  options: ViewerOptions
  error: any
  VERSION = VERSION
  static VERSION = VERSION

  constructor(documentUri: string, options: ViewerOptions = {}, initialState:InitialState = {}) {
    this.options = defaults(options, {
      httpHeaders: {},
      defaultSize: 20,
      getLocation: () => typeof window !== 'undefined' && window.location
    })
    this.documentUri = documentUri
    this.document = initialState.document
    this.state = initialState.state || {}
    this.transport = new AxiosManifestTransport(documentUri, {
      headers:this.options.httpHeaders,
      basicAuth:this.options.basicAuth,
      searchUrlPath:this.options.searchUrlPath,
      timeout: this.options.timeout,
      withCredentials: this.options.withCredentials
    })
  }

  setupListeners() {
    this.setDocument(this._get())
  }

  getDocumentAndState(){
    return {
      document: this.document,
      state: this.state
    }
  }

  _get() {
    this.currentDocumentRequest = new DocumentRequest(
      this.transport, this.documentUri, this)
    return this.currentDocumentRequest.run()
      .then(()=> {
        return Promise.resolve(this.getDocumentAndState())
      })
  }

  setDocument(document){
    this.document = document
  }

  setError(error){
    this.error = error
    console.error(this.error)
    this.document = null
   }
}
