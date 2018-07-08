"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var transport_1 = require("./transport");
var support_1 = require("./support");
var ViewerVersion_1 = require("./ViewerVersion");
var defaults = require("lodash/defaults");
var constant = require("lodash/constant");
var identity = require("lodash/identity");
var map = require("lodash/map");
var isEqual = require("lodash/isEqual");
var get = require("lodash/get");
var ViewerManager = /** @class */ (function () {
    function ViewerManager(host, options, initialState) {
        if (options === void 0) { options = {}; }
        if (initialState === void 0) { initialState = {}; }
        var _this = this;
        this.VERSION = ViewerVersion_1.VERSION;
        this.options = defaults(options, {
            useHistory: true,
            httpHeaders: {},
            searchOnLoad: true,
            defaultSize: 20,
            getLocation: function () { return typeof window !== 'undefined' && window.location; }
        });
        this.host = host;
        this.results = initialState.results;
        this.state = initialState.state || {};
        this.transport = this.options.transport || new transport_1.AxiosESTransport(host, {
            headers: this.options.httpHeaders,
            basicAuth: this.options.basicAuth,
            searchUrlPath: this.options.searchUrlPath,
            timeout: this.options.timeout,
            withCredentials: this.options.withCredentials
        });
        this.registrationCompleted = new Promise(function (resolve) {
            _this.completeRegistration = resolve;
        });
        this.translateFunction = constant(undefined);
        this.queryProcessor = identity;
        this.shouldPerformSearch = function () { return true; };
        this.emitter = new support_1.EventEmitter();
        this.resultsEmitter = new support_1.EventEmitter();
    }
    ViewerManager.mock = function (options) {
        if (options === void 0) { options = {}; }
        var searchkit = new ViewerManager("/", __assign({ useHistory: false, transport: new transport_1.MockESTransport() }, options));
        return searchkit;
    };
    ViewerManager.VERSION = ViewerVersion_1.VERSION;
    return ViewerManager;
}());
exports.ViewerManager = ViewerManager;
