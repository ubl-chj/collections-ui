import * as React from "react";

  export const Controls = () => {
    return (<div className="btn-group">
        <button type="button" className="btn btn-default btn-xs"><a id="zoom-in"><i className="glyphicon glyphicon-zoom-in"/></a></button>
        <button type="button" className="btn btn-default btn-xs"><a id="zoom-out"><i className="glyphicon glyphicon-zoom-out"/></a></button>
        <button type="button" className="btn btn-default btn-xs"><a id="reset"><i className="glyphicon glyphicon-home"/></a></button>
        <button type="button" className="btn btn-default btn-xs"><a id="full-page"><i className="glyphicon glyphicon-resize-full"/></a></button>
        <button type="button" className="btn btn-default btn-xs"><a href="/atomic"><i className="glyphicon glyphicon-search"/></a></button>
      </div>
    )
}

