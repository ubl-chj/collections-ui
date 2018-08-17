import React from 'react'
import {withRouter} from 'react-router-dom'

class BackArrowComponent extends React.Component<any, any> {
  props: any

  constructor(props) {
    super(props)
    this.props = props
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className='xjKiLb'>
        <button className='button-transparent' type="button" onClick={() => {
          this.goBack()
        }}>
          <svg className="JUQOtc" viewBox="0 0 24 24">
            <path style={{stroke: 'white', fill: 'white'}} d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
      </div>)
  }
}

export const BackArrow = withRouter(BackArrowComponent)
