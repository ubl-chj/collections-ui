import React from 'react'

export class ArrowRightIcon extends React.Component<any, any> {

  static arrowRightStyle() {
    return {
      background: 'rgba(66,66,66,0.54)',
      borderRadius: '28px',
      cursor: 'pointer',
      height: '56px',
      marginTop: '-28px',
      right: '28px',
      top: '50%',
      width: '56px',
      zIndex: 1000,
    }
  }

  static svgStyle() {
    return {
      fill: 'white',
      left: '10px',
      top: '10px',
    }
  }

  render() {
    return (
      <button
        aria-label='next item'
        id="sidebar-next"
        type="button"
        className='paging-control'
        style={ArrowRightIcon.arrowRightStyle()}
      >
        <svg
          width="36px"
          height="36px"
          style={ArrowRightIcon.svgStyle()}
          viewBox="0 0 24 24"
        >
          <path d='M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z'/>
        </svg>
      </button>
    )
  }
}
