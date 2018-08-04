import * as React from "react";
import {AuthUserContext} from "../../core";
import {Routes} from '../../../constants/Routes'
const firebase = require("firebase/app");

export const AuthUserTooltip = (props) => {
  const {} = props
  const notFoundImageUri = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
  return (
        <AuthUserContext.Consumer>
          {(authUser) => authUser ? <div>{
            firebase.auth().currentUser.photoURL ?  <img className="account-image"
              src={firebase.auth().currentUser.photoURL} alt="Account's profile image"
              aria-hidden="true" /> : <img className="account-image"
              src={notFoundImageUri} alt="Account's profile image"
              aria-hidden="true" />
          }
            <div className="gb_yb">
              <div className="gb_Bb">{firebase.auth().currentUser.displayName}</div>
              <div className="gb_Db">{firebase.auth().currentUser.email}</div>
              <a role="button" className="btn btn-outline-secondary" href={Routes.ACCOUNT}>Account</a>
              <a role="button" className="btn btn-outline-secondary"
                onClick={() => firebase.auth().signOut()}>Sign-out</a>
            </div>
          </div> : null}
        </AuthUserContext.Consumer>)
}
