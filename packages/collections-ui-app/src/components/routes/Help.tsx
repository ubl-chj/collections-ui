import {AuthProfile, firebase, LogoWrapper, NavMenu, withDynamicLayout} from 'collections-ui-common'
import * as React from "react"
import {Layout, LayoutBody, LayoutResults, SideBar, TopBar} from "searchkit-fork"
import {IRouteProps} from "./IRouteProps"

export class Help extends React.Component<IRouteProps, any> {

  constructor(props) {
    super(props)
    this.state = {
      width: props.width,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
  }

  render() {
    const {width} = this.state
    return(
      <div id='outer' style={{background: '#efefef', position: 'absolute', height: '100%', width: '100%'}}>
        <NavMenu/>
        <div id='inner' style={{height: '100%'}}>
          <Layout>
            <TopBar>
              <LogoWrapper/>
              <div style={{display: 'flex', flex: '1 1'}}/>
              <AuthProfile width={width}/>
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
