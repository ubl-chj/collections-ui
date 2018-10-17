import * as React from "react";

export class ArrowRightIcon extends React.Component<any, any> {
  render() {
    return (
      <button
        aria-label='next item'
        id="sidebar-next"
        type="button"
        className="btn btn-primary-outline btn-xs"
      >
          <svg className="JUQOtd" viewBox="0 0 20.57 38">
            <polyline style={{stroke: 'black', fill: 'black'}} points="2.03 36 18.57 19.14 2 2"/>
          </svg>
      </button>
    )
  }
}
