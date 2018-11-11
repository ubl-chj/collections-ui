import {AuthProfile, LogoWrapper, NavMenu, withAuthorization, withDynamicLayout} from 'collections-ui-common'
import * as React from "react"
import {Layout, LayoutBody, LayoutResults, SideBar, TopBar} from "searchkit-fork"
import {IRouteProps} from "./IRouteProps"

export class SettingsPage extends React.Component<IRouteProps, any> {

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
                Settings (Work in Progress)
              </LayoutResults>
            </LayoutBody>
          </Layout>
        </div>
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser
export default withAuthorization(authCondition)(withDynamicLayout(SettingsPage))
