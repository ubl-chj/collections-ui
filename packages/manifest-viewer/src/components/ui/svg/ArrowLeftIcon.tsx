import React from 'react'

export class ArrowLeftIcon extends React.Component<any, any> {
  static arrowLeftStyle() {
    const absolute: 'absolute' = 'absolute'
    return {
      background: 'rgba(66,66,66,0.54)',
      borderRadius: '28px',
      cursor: 'pointer',
      height: '56px',
      marginTop: '-28px',
      position: absolute,
      top: '50%',
      width: '56px',
      zIndex: 1000,
    }
  }

  static svgStyle() {
    const absolute: 'absolute' = 'absolute'
    return {
      fill: 'white',
      left: '10px',
      position: absolute,
      top: '10px',
    }
  }

  render() {
    return (
      <button
        aria-label='previous item'
        className='paging-control'
        id="sidebar-previous"
        style={ArrowLeftIcon.arrowLeftStyle()}
        type="button"
      >
        <svg
          height="36px"
          style={ArrowLeftIcon.svgStyle()}
          viewBox="0 0 24 24"
          width="36px"
        >
          <path d='M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z'/>
        </svg>
      </button>
    )
  }
}
