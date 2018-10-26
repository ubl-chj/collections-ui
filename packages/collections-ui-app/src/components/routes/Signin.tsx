import {AuthUserContext, LogoWrapper, withAuthorization} from 'collections-ui-common'
import 'firebase/auth'
import * as React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import {Link, withRouter} from 'react-router-dom'
import {Layout, LayoutBody, LayoutResults, TopBar} from 'searchkit-fork'
import '../../styles/firebaseui-styling.global.css'
import {} from "../ui"

const styles = require('../../styles/firebase-auth.css')
const firebase = require("firebase/app")
const firebaseApiKey = process.env.REACT_APP_FIREBASE_KEY

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: 'collections-ui-1532736515660.firebaseapp.com',
  databaseURL: 'https://collections-ui-1532736515660.firebaseio.com',
  messagingSenderId: '851210977979',
  projectId: 'collections-ui-1532736515660',
  storageBucket: '',
}

const firebaseApp = firebase.initializeApp(firebaseConfig);

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
                : <StyledFirebaseAuth className={styles.firebaseUi} uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()}/>
              }
            </AuthUserContext.Consumer>
          </LayoutResults>
        </LayoutBody>
      </Layout>
    )
  }
}
