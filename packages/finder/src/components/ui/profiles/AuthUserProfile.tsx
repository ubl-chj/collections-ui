import * as React from "react";
import {AuthUserContext} from "../../core";
import * as routes from '../../../constants/routes';
const firebase = require("firebase");

export const AuthUserProfile = (props) => {
  const {toggle} = props
  return (
    <AuthUserContext.Consumer>
      {(authUser) => authUser ?
        <div><a role="dialog" onClick={toggle}><img className="account-image"
          src={firebase.auth().currentUser.photoURL} alt="Account's profile image"
          aria-hidden="true"/></a>
        </div> : <div><a className="btn btn-outline-secondary" href={routes.SIGN_IN}>Login</a></div>}
    </AuthUserContext.Consumer>
  )
}
