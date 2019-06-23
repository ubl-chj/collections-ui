import {AuthProfile, LogoWrapper, NavMenu} from 'collections-ui-common'
import React from 'react'
import {Layout, LayoutBody, LayoutResults, SideBar, TopBar} from 'searchkit'
import {IRouteProps} from './IRouteProps'

export class Help extends React.Component<IRouteProps, any> {

  constructor(props) {
    super(props)
    this.state = {
      isMobile: props.isMobile,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isMobile !== prevProps.isMobile) {
      this.setState({isMobile: this.props.isMobile})
    }
  }

  render() {
    const {isMobile} = this.state
    return(
      <div id='outer' style={{background: '#efefef', position: 'absolute', height: '100%', width: '100%'}}>
        <NavMenu/>
        <div id='inner' style={{height: '100%'}}>
          <Layout>
            <TopBar>
              <LogoWrapper/>
              <div style={{display: 'flex', flex: '1 1'}}/>
              <AuthProfile isMobile={isMobile}/>
            </TopBar>
            <LayoutBody>
              <SideBar/>
              <LayoutResults>
                Help & Feedback (Work in Progress)
              </LayoutResults>
            </LayoutBody>
          </Layout>
        </div>
      </div>
    )
  }
}
