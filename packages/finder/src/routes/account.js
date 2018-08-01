import React from 'react'

import {AuthUserContext, withAuthorization} from '../components/core'
import {ActionBar, Layout, LayoutBody, LayoutResults, SideBar, TopBar} from 'searchkit'
import * as routes from '../constants/routes';

const AccountPage = () => <Layout>
  <TopBar>
    <div className='my-logo'><a className='my-logo' href={routes.LANDING} target='_blank'>UBL</a></div>
  </TopBar>
  <LayoutBody>
    <SideBar>
    </SideBar>
    <LayoutResults>
      <ActionBar>
        <AuthUserContext.Consumer>
          {(authUser) => <div>
            <h1>Account: {authUser.email}</h1>
          </div>}
        </AuthUserContext.Consumer>
      </ActionBar>
    </LayoutResults>
  </LayoutBody>
</Layout>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(AccountPage)
