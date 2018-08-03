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
import * as domain from '../constants/domain'

const SignInPage = ({ history }) =>
  <div>
    <h1>SignIn</h1>
    <SignInForm history={history} />
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

class SignInForm extends Component {
  render () {
    const t = Boolean(true)
    return (<Layout>
        <TopBar>
          <div className='my-logo'><a className='my-logo' href={routes.LANDING} target='_blank'>{domain.LOGO_TEXT}</a></div>
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

export {
  SignInForm,
};
