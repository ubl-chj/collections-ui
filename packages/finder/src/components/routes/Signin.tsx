import * as React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import {Link, withRouter} from 'react-router-dom'
import {Layout, LayoutBody, LayoutResults, TopBar} from 'searchkit-fork'
import '../../styles/firebaseui-styling.global.css'
import {AuthUserContext} from '../core'
import {LogoWrapper} from "../ui"

const styles = require('../../styles/firebase-auth.css')
const firebase = require("firebase/app")
const firebaseApiKey = process.env.REACT_APP_FIREBASE_KEY

const config = {
  apiKey: firebaseApiKey,
  authDomain: 'collections-ui-1532736515660.firebaseapp.com',
  databaseURL: 'https://collections-ui-1532736515660.firebaseio.com',
  messagingSenderId: '851210977979',
  projectId: 'collections-ui-1532736515660',
  storageBucket: '',
}

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: '/account',
}

export class SignIn extends React.Component {
  render() {
    return (
      <Layout>
      <TopBar>
        <LogoWrapper/>
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
    </Layout>
    )
  }
}
