import {AuthUserContext, LogoWrapper, firebase} from 'collections-ui-common'
import React, {ReactElement} from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import {Layout, LayoutBody, LayoutResults, TopBar} from 'searchkit'
import '../../styles/firebaseui-styling.global.css'
const styles = require('../../styles/firebase-auth.css')

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: '/account',
}

export const SignIn: React.FC<any> = (): ReactElement => {
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
