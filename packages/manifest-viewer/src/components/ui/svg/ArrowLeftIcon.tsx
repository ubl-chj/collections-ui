import * as React from "react";

export class ArrowLeftIcon extends React.Component<any, any> {
  render() {
    return (
      <button
        aria-label='previous item'
        id="sidebar-previous"
        type="button"
        className="btn-viewer btn-xs"
      >
          <svg className="JUQOtd" viewBox="0 0 20.57 38">
            <polyline style={{stroke: 'black', fill: 'black'}} points="18.54 2 2 18.86 18.57 36"/>
          </svg>
      </button>
    )
  }
}
