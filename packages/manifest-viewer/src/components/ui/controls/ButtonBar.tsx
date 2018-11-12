import {AuthUserContext, FavoriteButton, firebase} from 'collections-ui-common'
import * as React from 'react'
import {HomeIcon, RotateLeftIcon, RotateRightIcon, ZoomInIcon, ZoomOutIcon} from "../svg"

export class ButtonBar extends React.Component<any, any> {

  constructor(props) {
    super(props)
  }

  buildFavoriteButton() {
    const {locationState} = this.props
    if (locationState) {
      return (
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
            <FavoriteButton
              authUser={firebase.auth.currentUser}
              className='btn-viewer btn-xs'
              result={locationState.result}
            /> : null}
        </AuthUserContext.Consumer>)
    } else {
      return null
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.buildFavoriteButton()}
        <ZoomInIcon/>
        <ZoomOutIcon/>
        <HomeIcon/>
        <RotateLeftIcon/>
        <RotateRightIcon/>
      </div>
    )
  }
}
