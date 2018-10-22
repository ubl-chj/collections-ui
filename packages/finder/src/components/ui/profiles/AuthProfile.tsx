import * as React from "react";
import {AuthUserContext} from "../../core";
import {AuthUserProfile} from "./AuthUserProfile"
import {AuthUserTooltip} from "./AuthUserTooltip"

const ReactTooltip = require('react-tooltip')
export class AuthProfile extends React.Component<any, any> {

  state: {
    width: number,
  }

  constructor(props) {
    super(props)
    this.state = {
      width: props.width,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
  }

  render() {
    const {width} = this.state
    const isMobile = width <= 500
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
