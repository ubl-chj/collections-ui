import React, {Component} from 'react'
import firebase from 'firebase/app';
import 'firebase/auth';
import {withRouter} from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import {Layout, LayoutBody, LayoutResults, TopBar} from 'searchkit'
import styles from '../assets/app.css'
import '../assets/firebaseui-styling.global.css'
import {AuthUserContext} from '../components/core/AuthUserContext';
import * as routes from '../constants/routes';

const SignInPage = ({ history }) =>
  <div>
    <h1>SignIn</h1>
    <SignInForm history={history} />
  </div>

const firebaseApi_key = process.env.REACT_APP_FIREBASE_KEY
const baseUrl = process.env.REACT_APP_BASEURL

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
  signInSuccessUrl: baseUrl,
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => true,
  },
}

class SignInForm extends Component {
  render () {
    return (<Layout>
        <TopBar>
          <div className='my-logo'><a className='my-logo' href={routes.LANDING} target='_blank'>UBL</a></div>
        </TopBar>
        <LayoutBody>
          <LayoutResults>
            <AuthUserContext.Consumer>
              {(authUser) => authUser
                ? <div><p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
                <a role="button" onClick={() => firebase.auth().signOut()}>Sign-out</a></div>
                : <StyledFirebaseAuth className={styles.firebaseUi} uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
              }
            </AuthUserContext.Consumer>
          </LayoutResults>
        </LayoutBody>
      </Layout>)
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};
