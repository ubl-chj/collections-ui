import * as React from 'react'
import {AuthUserContext} from '../../auth/'
import {AuthUserProfile} from "./AuthUserProfile"
import {AuthUserTooltip} from "./AuthUserTooltip"

const ReactTooltip = require('react-tooltip')
export class AuthProfile extends React.Component<any, any> {

  state: {
    isMobile: boolean,
  }

  constructor(props) {
    super(props)
    this.state = {
      isMobile: props.isMobile,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isMobile !== prevProps.isMobile) {
      this.setState({isMobile: this.props.isMobile})
    }
  }

  render() {
    const {isMobile} = this.state
    if (isMobile) {
      return null
    } else {
      return(
        <div>
          <div data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
            <AuthUserProfile/>
          </div>
          <AuthUserContext.Consumer>
            {(authUser) => authUser ?
            <ReactTooltip
              className='authUserTooltip'
              id='authUserProfile'
              offset={{left: 170}}
              globalEventOff='click'
              border={Boolean(true)}
              place='bottom'
              type='light'
              effect='solid'
              getContent={() => <AuthUserTooltip/>}
            /> : null
            }
          </AuthUserContext.Consumer>
          </div>)
    }
  }
}
