import React from 'react'
import {withRouter} from 'react-router-dom'

class BackArrowComponent extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    window.onkeydown = this.listenForKeydown.bind(this)
  }

  listenForKeydown(e) {
    e = e || window.event;

    if (e.key === 'Escape') {
      this.props.history.goBack()
    }
  }

  goBack = () => {
    this.props.history.goBack()
  }

  render() {
    return (
      <button
        aria-label='go back'
        className='button-transparent'
        onClick={this.goBack}
        title='Go back'
        type="button"
      >
        <svg
          className="JUQOtc"
          viewBox="0 0 24 24"
        >
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" style={{stroke: 'white', fill: 'white'}}/>
        </svg>
      </button>
    )
  }
}

export const BackArrow = withRouter(BackArrowComponent)
