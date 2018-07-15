import * as React from "react";

  export const Controls = (props) => {
    const {index, manifest, count} = props
    const next = parseInt(index) + 1
    const previous = parseInt(index) -1;
    let left;
    let right;

    if (index) {
      const pagerPrevious = "/osd?index=" + previous + "&count=" + "&manifest=" + encodeURIComponent(manifest);
      const pagerNext = "/osd?index=" + next + "&count=" + count + "&manifest=" + encodeURIComponent(manifest);
      left = <button type="button" className="btn btn-primary-outline btn-xs"><a href={pagerPrevious}><i className="glyphicon glyphicon-chevron-left"/></a></button>
      right = <button type="button" className="btn btn-primary-outline btn-xs"><a href={pagerNext}><i className="glyphicon glyphicon-chevron-right"/></a></button>
    }

    return (<div className="btn-group">
        <button type="button" className="btn btn-primary-outline btn-xs"><a id="zoom-in"><i className="glyphicon glyphicon-zoom-in"/></a></button>
        <button type="button" className="btn btn-primary-outline btn-xs"><a id="zoom-out"><i className="glyphicon glyphicon-zoom-out"/></a></button>
        <button type="button" className="btn btn-primary-outline btn-xs"><a id="reset"><i className="glyphicon glyphicon-home"/></a></button>
        <button type="button" className="btn btn-primary-outline btn-xs"><a id="full-page"><i className="glyphicon glyphicon-resize-full"/></a></button>
        <button type="button" className="btn btn-primary-outline btn-xs"><a href="/atomic"><i className="glyphicon glyphicon-search"/></a></button>
        {left}
        {right}
      </div>
    )
}

