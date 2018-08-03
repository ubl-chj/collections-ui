import React from 'react'

import {AuthUserContext, withAuthorization} from '../components/core'
import {
  ActionBar, Layout, LayoutBody, LayoutResults, SearchBox, SearchkitManager, SearchkitProvider, SideBar, TopBar
} from 'searchkit'
import * as routes from '../constants/routes'
import firebase from 'firebase'
import {AuthUserProfile, AuthUserTooltip} from '../components/ui'
import ReactTooltip from 'react-tooltip'
import * as domain from '../constants/domain';

const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_ATOMIC_INDEX

const options = {
  timeout: 20000
}
const searchkit = new SearchkitManager(host, options)

const queryFields = []

const t = Boolean(true)
const AccountPage = () => <SearchkitProvider searchkit={searchkit}>
  <Layout>
    <TopBar>
      <div className='my-logo'><a className='my-logo' href={routes.LANDING} target='_blank'>{domain.LOGO_TEXT}</a></div>
      <SearchBox autofocus={true} searchOnChange={true} queryFields={queryFields}/>
      <div data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
        <AuthUserProfile/>
      </div>
      <ReactTooltip id='authUserProfile' offset={{left: 170}} globalEventOff='click' border={t} place='bottom'
        type='light' effect='solid'>
        <AuthUserTooltip/>
      </ReactTooltip>
    </TopBar>
    <LayoutBody>
      <SideBar>
      </SideBar>
      <LayoutResults>
        <ActionBar>
          <AuthUserContext.Consumer>
            {(authUser) => <div>
              <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
              <h1>Account: {authUser.email}</h1>
            </div>}
          </AuthUserContext.Consumer>
        </ActionBar>
      </LayoutResults>
    </LayoutBody>
  </Layout>
</SearchkitProvider>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(AccountPage)
