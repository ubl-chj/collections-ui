import * as React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {ActionBar, Layout, LayoutBody, LayoutResults, SearchkitManager, SearchkitProvider, SideBar} from 'searchkit-fork'
import {AuthUserContext, withAuthorization, withDynamicLayout} from '../core'
import {BMenu, FavoritesList, Head} from '../ui'
import {IRouteProps} from "./IRouteProps";

const firebase = require("firebase/app")

export class AccountPage extends React.Component<IRouteProps, any> {

  static defaultProps = {
    host: process.env.REACT_APP_ELASTICSEARCH_HOST,
    options: {timeout: 20000},
    routeConfig: require('./config/landing.json'),
    searchkit: {},
  }

  searchkit: SearchkitManager
  routeKey: string
  state: {
    width: number,
  }

  constructor(props) {
    super(props)
    this.routeKey = this.props.routeConfig.indexName
    const host = props.host + this.routeKey
    this.searchkit = new SearchkitManager(host, props.options)
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
      const {routeConfig} = this.props
      const {width} = this.state
      return (
        <SearchkitProvider searchkit={this.searchkit}>
          <div id='outer-container'>
            <BMenu/>
            <div id='page-wrap'>
              <Layout>
                <Head width={width} routeConfig={routeConfig}/>
                <LayoutBody>
                  <SideBar/>
                  <LayoutResults>
                    <ActionBar>
                      <AuthUserContext.Consumer>
                        {(authUser) => <div>
                          <p>Welcome {firebase.auth().currentUser.displayName}!</p>
                          <h2>My Workspace</h2>
                          <ListFavoritesWithRouter authUser={authUser}/>
                        </div>}
                      </AuthUserContext.Consumer>
                    </ActionBar>
                  </LayoutResults>
                </LayoutBody>
              </Layout>
            </div>
          </div>
        </SearchkitProvider>)
  }
}

const authCondition = (authUser) => !!authUser
const ListFavoritesWithRouter = withRouter(FavoritesList)
export default withAuthorization(authCondition)(withDynamicLayout(AccountPage))
