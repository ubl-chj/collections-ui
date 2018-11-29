import * as React from 'react';

const compact = require('lodash/compact')

const mixClasses = (...classes) => {
  return compact(classes).join(' ')
}
export const LayoutBuilder = (className) => {
  return (props) => (
    <div className={mixClasses(className, props.className)}>
      {props.children}
    </div>
  )
}
export const LayoutBody = LayoutBuilder('viewer-layout__body')
export const LayoutResults = LayoutBuilder('viewer-layout__results viewer-results-list')
export const ActionBar = LayoutBuilder('viewer-results-list__action-bar viewer-action-bar')
export const ActionBarRow = LayoutBuilder('viewer-action-bar-row')
export const SideBar = LayoutBuilder('viewer-layout__filters')

export const TopBar = (props) => (
  <div className={mixClasses('viewer-layout__top-bar viewer-top-bar', props.className)}>
    <div className="viewer-top-bar__content">
      {props.children}
    </div>
  </div>
)

export const Layout = (props) => {
  const sizeClass = props.size ? 'viewer-layout__size-' + props.size : null
  return (
    <div className={mixClasses('viewer-layout', props.className, sizeClass)}>
      {props.children}
    </div>
  )
}
