import * as React from "react";
const manifesto = require('manifesto.js')

export const Controls = (props) => {
  const {document, bemBlocks} = props
  if (document) {
    const manifest = manifesto.create(document)
    const title = manifesto.TranslationCollection.getValue(manifest.getLabel())
    return (<div className="manifest-info">
      <div className="btn-group">
        <button type="button" className="btn btn-primary-outline btn-xs"><a id="zoom-in"><i
          className="glyphicon glyphicon-zoom-in"/></a></button>
        <button type="button" className="btn btn-primary-outline btn-xs"><a id="zoom-out"><i
          className="glyphicon glyphicon-zoom-out"/></a></button>
        <button type="button" className="btn btn-primary-outline btn-xs"><a id="reset"><i
          className="glyphicon glyphicon-home"/></a></button>
        <button type="button" className="btn btn-primary-outline btn-xs"><a id="full-page"><i
          className="glyphicon glyphicon-resize-full"/></a></button>
        <button type="button" className="btn btn-primary-outline btn-xs"><a href="/atomic"><i
          className="glyphicon glyphicon-search"/></a></button>
        <button type="button" className="btn btn-primary-outline btn-xs"><a id="sidebar-previous"><i
          className="glyphicon glyphicon-chevron-left"/></a></button>
        <button type="button" className="btn btn-primary-outline btn-xs"><a id="sidebar-next"><i
          className="glyphicon glyphicon-chevron-right"/></a></button>
      </div>
        <div className="window-manifest-title">
        <h2 className="window-manifest-title">{title}</h2>
        </div>
      </div>
    )
  }
  return(null)
}

