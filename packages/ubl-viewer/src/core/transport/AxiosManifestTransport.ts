import axios, {AxiosInstance, AxiosResponse} from "axios"
import {ManifestTransport} from "./ManifestTransport"

const defaults = require("lodash/defaults")

export interface IManifestTransportOptions {
  headers?: object,
  basicAuth?: string,
  withCredentials?: boolean,
  searchUrlPath?: string,
  timeout?: number
}

export class AxiosManifestTransport extends ManifestTransport {
  static timeout: number = 20000

  static getData(response) {
    return response.data
  }

  private static parseCredentials(options: IManifestTransportOptions): any {
    const credentials = {
      auth: null,
      withCredentials: false,
     }
    if (options.basicAuth !== undefined) {
       const parsed = options.basicAuth.split(":")
       credentials.auth = {username: parsed[0], password: parsed[1]}
    }
    if (options.withCredentials) {
       credentials.withCredentials = true
    }
    return credentials
  }
  axios: AxiosInstance
  options: IManifestTransportOptions

  constructor(public host: string, options: IManifestTransportOptions = {}) {
    super()
    this.options = defaults(options, {
      headers: {},
      timeout: AxiosManifestTransport.timeout,
    })

    const credentials = AxiosManifestTransport.parseCredentials(this.options)
    const config = defaults(credentials, {
      baseURL: this.host,
      headers: this.options.headers,
      timeout: this.options.timeout,
    })
    this.axios = axios.create(config)
  }

  get(documentUri: string): Promise<AxiosResponse> {
    return this.axios.get(documentUri)
      .then(AxiosManifestTransport.getData)
  }
}
