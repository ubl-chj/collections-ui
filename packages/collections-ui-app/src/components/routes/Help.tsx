import * as React from "react"
import {IRouteProps} from "./IRouteProps"
import {Layout, LayoutBody, LayoutResults, SideBar, TopBar} from "searchkit-fork"
import {AuthProfile, NavMenu, firebase, LogoWrapper, withDynamicLayout} from 'collections-ui-common'

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
                Help (Work in Progress)
              </LayoutResults>
            </LayoutBody>
          </Layout>
        </div>
      </div>
    )
  }
}
