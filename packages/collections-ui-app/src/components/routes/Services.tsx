import {AuthProfile, LogoWrapper, NavMenu} from 'collections-ui-common'
import React, {ReactElement} from 'react'
import {Layout, LayoutBody, LayoutResults, SideBar, TopBar} from 'searchkit'
import {IRouteProps} from './IRouteProps'

const ReactMarkdown = require('react-markdown')

export const Services: React.FC<IRouteProps> = (): ReactElement => {
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
        </Layout>
        <LayoutBody>
          <SideBar/>
          <LayoutResults>
            Services (Work in Progress)
          </LayoutResults>
        </LayoutBody>
      </div>
    </div>
  )
}
