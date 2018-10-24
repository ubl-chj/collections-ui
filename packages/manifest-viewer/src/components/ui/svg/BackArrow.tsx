import React from 'react'
import keydown from 'react-keydown'
import {withRouter} from 'react-router-dom'

@keydown
class BackArrowComponent extends React.Component<any, any> {

  constructor(props) {
    super(props)
 }

  componentWillReceiveProps({keydown}) {
    if ( keydown.event ) {
      if (keydown.event.code === 'ArrowLeft') {
        this.props.history.goBack()
      }
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
          title='Go back'
          type="button"
          onClick={this.goBack}
        >
          <svg className="JUQOtc" viewBox="0 0 24 24">
            <path style={{stroke: 'white', fill: 'white'}} d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
      )
  }
}

export const BackArrow = withRouter(BackArrowComponent)
