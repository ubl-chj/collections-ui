import * as React from 'react'

import 'firebase/auth';
import {withRouter} from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import {Layout, LayoutBody, LayoutResults, TopBar} from 'searchkit-fork'
import '../../assets/firebaseui-styling.global.css'
import {AuthUserContext} from '../core';
import {Routes, Domain} from '../../constants'

const styles = require('../../assets/app.css')
const firebase = require("firebase/app");
const SignInPage = () =>
  <div>
    <h1>SignIn</h1>
    <SignInForm/>
  </div>

const firebaseApi_key = process.env.REACT_APP_FIREBASE_KEY


const config = {
  apiKey: firebaseApi_key,
  authDomain: 'collections-ui-1532736515660.firebaseapp.com',
  databaseURL: 'https://collections-ui-1532736515660.firebaseio.com',
  projectId: 'collections-ui-1532736515660',
  storageBucket: '',
  messagingSenderId: '851210977979'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const uiConfig = {
  signInSuccessUrl: '/account',
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  ]
}

export class SignInForm extends React.Component {
  render () {
    const t = Boolean(true)
    return (<Layout>
        <TopBar>
          <div className='my-logo'><a className='my-logo' href={Routes.LANDING} target='_blank'>{Domain.LOGO_TEXT}</a></div>
        </TopBar>
        <LayoutBody>
          <LayoutResults>
            <AuthUserContext.Consumer>
              {(authUser) => authUser
                ? null
                : <StyledFirebaseAuth className={styles.firebaseUi} uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
              }
            </AuthUserContext.Consumer>
          </LayoutResults>
        </LayoutBody>
      </Layout>)
  }
}

const authCondition = (authUser) => !!authUser

export default withRouter(SignInPage);

