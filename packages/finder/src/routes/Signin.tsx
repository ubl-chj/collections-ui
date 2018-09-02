import * as React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import {Link, withRouter} from 'react-router-dom'
import {Layout, LayoutBody, LayoutResults, TopBar} from 'searchkit-fork'
import {AuthUserContext} from '../components/core'
import {Domain, Routes} from '../constants'
import '../styles/firebaseui-styling.global.css'
import {Logo} from "../components/ui/svg";

const styles = require('../styles/app.css')
const firebase = require("firebase/app");
const firebaseApiKey = process.env.REACT_APP_FIREBASE_KEY

const config = {
  apiKey: firebaseApiKey,
  authDomain: 'collections-ui-1532736515660.firebaseapp.com',
  databaseURL: 'https://collections-ui-1532736515660.firebaseio.com',
  messagingSenderId: '851210977979',
  projectId: 'collections-ui-1532736515660',
  storageBucket: '',
};

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
        <div className='my-logo'>
          <Link className='my-logo' to={Routes.LANDING}>
            <Logo className='JUQOtf'/>
            <span className='JUQOtq'>{Domain.LOGO_TEXT}</span>
          </Link>
        </div>
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
