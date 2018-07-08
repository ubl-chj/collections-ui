import {VERSION} from "./ViewerVersion"

const defaults = require("lodash/defaults")

export interface ViewerOptions {
    useHistory?:boolean
    createHistory?:Function
    getLocation?:Function
    searchOnLoad?:boolean
    httpHeaders?:Object
    basicAuth?:string
    searchUrlPath?:string
    timeout?: number
    withCredentials? : boolean
    defaultSize?:number
}

export interface InitialState {
    state?:Object
}

export class ViewerManager {
    host:string
    options:ViewerOptions
    error:any
    VERSION = VERSION
    static VERSION = VERSION

    constructor(host:string, options:ViewerOptions = {}){
        this.options = defaults(options, {
             httpHeaders:{},
            defaultSize:20,
            getLocation:()=> typeof window !== 'undefined' && window.location
        })
        this.host = host
    }
}
