import * as React from 'react'
import {Link} from 'react-router-dom'
import {
  ActionBar, Layout, LayoutBody, LayoutResults, SearchBox, SearchkitManager, SearchkitProvider, SideBar, TopBar
} from 'searchkit-fork'
import {AuthUserContext, withAuthorization} from '../core'
import {AuthUserProfile, AuthUserTooltip} from '../ui/index'
import {Routes, Domain} from '../../constants';
const firebase = require("firebase/app");
const ReactTooltip = require('react-tooltip')
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
      <div className='my-logo'>
        <Link className='my-logo' to={Routes.LANDING}>{Domain.LOGO_TEXT}</Link>
      </div>
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
