import * as React from "react";
import {Link} from 'react-router-dom'
import {Col, Container, Row} from 'reactstrap';
import {Domain, Routes} from '../../../constants'
import {AuthUserContext} from "../../core";

const firebase = require("firebase/app");

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
        }</a></div> :
        <div className="gb_Ng">
          <Link className='btn btn-outline-secondary float-right' to={Routes.SIGN_IN}>{Domain.LOGIN_TEXT}</Link>
        </div>}
    </AuthUserContext.Consumer>
  )
}
