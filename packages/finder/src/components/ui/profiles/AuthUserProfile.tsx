import * as React from "react";
import {AuthUserContext} from "../../core";
import { Container, Row, Col } from 'reactstrap';
import * as routes from '../../../constants/routes';

const firebase = require("firebase");

export const AuthUserProfile = (props) => {
  const {dataFor} = props
  const notFoundImageUri = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
  return (
    <AuthUserContext.Consumer>
      {(authUser) => authUser ?
        <div className="gb_Ng"><a role="dialog">{
          firebase.auth().currentUser.photoURL ?  <img className="account-image"
            src={firebase.auth().currentUser.photoURL} alt="Account's profile image"
            aria-hidden="true" /> : <img className="account-image"
            src={notFoundImageUri} alt="Account's profile image"
            aria-hidden="true" />
        }</a></div>:
        <div className="gb_Ng"><a className="btn btn-outline-secondary float-right" href={routes.SIGN_IN}>Login</a></div>}
    </AuthUserContext.Consumer>
  )
}
