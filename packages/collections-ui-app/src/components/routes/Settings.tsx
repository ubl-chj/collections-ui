import {AuthProfile, LogoWrapper, NavMenu, withAuthorization, withDynamicLayout} from 'collections-ui-common'
import React, {ReactElement} from 'react'
import {Layout, LayoutBody, LayoutResults, SideBar, TopBar} from 'searchkit'
import {IRouteProps} from './IRouteProps'

export const SettingsPage: React.FC<IRouteProps> = (): ReactElement => {
  return (
    <div id='outer' style={{background: '#efefef', position: 'absolute', height: '100%', width: '100%'}}>
      <NavMenu/>
      <div id='inner' style={{height: '100%'}}>
        <Layout>
          <TopBar>
            <LogoWrapper/>
            <div style={{display: 'flex', flex: '1 1'}}/>
            <AuthProfile/>
          </TopBar>
          <LayoutBody>
            <SideBar/>
            <LayoutResults>
              Settings (Work in Progress)
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </div>
    </div>
  )
}

const authCondition = (authUser) => !!authUser
export default withAuthorization(authCondition)(withDynamicLayout(SettingsPage))
