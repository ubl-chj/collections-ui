import React from 'react'

export class FullScreenIcon extends React.Component<any, any> {
  render() {
    return (
      <button
        aria-label='full screen'
        id="full-page"
        type="button"
        className="button-transparent"
      >
          <svg className="JUQOtc" viewBox="0 0 357 357">
            <path
              style={{stroke: 'white', fill: 'white'}}
              d="M51,229.5H0V357h127.5v-51H51V229.5z M0,127.5h51V51h76.5V0H0V127.5z
              M306,306h-76.5v51H357V229.5h-51V306z M229.5,0v51 H306v76.5h51V0H229.5z"
            />
          </svg>
      </button>
    )
  }
}
