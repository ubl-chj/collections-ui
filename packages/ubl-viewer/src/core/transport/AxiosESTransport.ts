import axios, { AxiosInstance, AxiosResponse } from "axios"
import {ManifestTransport} from "./ManifestTransport"
const defaults = require("lodash/defaults")

export interface ESTransportOptions {
  headers?:Object,
  basicAuth?:string,
  withCredentials?:boolean,
  searchUrlPath?:string,
  timeout?: number
}

export class AxiosManifestTransport extends ManifestTransport{
  static timeout: number = 20000
  axios: AxiosInstance
  options: ESTransportOptions

  constructor(public host:string, options:ESTransportOptions={}){
    super()
    this.options = defaults(options, {
      headers:{},
      timeout: AxiosManifestTransport.timeout
    })

    const credentials = AxiosManifestTransport.parseCredentials(this.options)
    const config = defaults(credentials, {
      baseURL:this.host,
      timeout:this.options.timeout,
      headers:this.options.headers
    })
    this.axios = axios.create(config)
  }

  get(documentUri:string): Promise<AxiosResponse> {
    return this.axios.get(documentUri)
      .then(this.getData)
  }

  getData(response){
    return response.data
  }

  private static parseCredentials(options: ESTransportOptions): any {
    let credentials = {}
    if (options.basicAuth !== undefined) {
       const parsed = options.basicAuth.split(":")
       const auth = { username: parsed[0], password: parsed[1] }
       credentials['auth'] = auth
    }
    if (options.withCredentials) {
       credentials['withCredentials'] = true
    }
    return credentials
  }
}
