"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var compact = require("lodash/compact");
var mixClasses = function () {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return compact(classes).join(" ");
};
exports.LayoutBuilder = function (className) {
    return function (props) { return (<div className={mixClasses(className, props.className)}>
            {props.children}
        </div>); };
};
exports.LayoutBody = exports.LayoutBuilder("sk-layout__body");
exports.LayoutResults = exports.LayoutBuilder("sk-layout__results sk-results-list");
exports.ActionBar = exports.LayoutBuilder("sk-results-list__action-bar sk-action-bar");
exports.ActionBarRow = exports.LayoutBuilder("sk-action-bar-row");
exports.SideBar = exports.LayoutBuilder("sk-layout__filters");
exports.TopBar = function (props) { return (<div className={mixClasses("sk-layout__top-bar sk-top-bar", props.className)}>
        <div className="sk-top-bar__content">
            {props.children}
        </div>
    </div>); };
exports.Layout = function (props) {
    var sizeClass = props.size ? "sk-layout__size-" + props.size : null;
    return (<div className={mixClasses("sk-layout", props.className, sizeClass)}>
            {props.children}
        </div>);
};
