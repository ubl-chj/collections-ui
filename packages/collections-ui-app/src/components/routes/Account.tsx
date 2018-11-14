import {AuthUserContext, firebase, NavMenu, withAuthorization, withDynamicLayout} from 'collections-ui-common'
import * as React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {ActionBar, Layout, LayoutBody, LayoutResults, SearchkitManager, SearchkitProvider, SideBar} from 'searchkit-fork'
import {FavoritesList, Head} from '../ui'
import {IRouteProps} from "./IRouteProps"

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
    if (firebase) {
      const {routeConfig} = this.props
      const {width} = this.state
      return (
        <SearchkitProvider searchkit={this.searchkit}>
          <div style={{background: '#efefef'}} id='outer'>
            <NavMenu/>
            <div id='inner'>
              <Layout>
                <Head width={width} routeConfig={routeConfig}/>
                <LayoutBody>
                  <SideBar/>
                  <LayoutResults>
                    <ActionBar>
                      <AuthUserContext.Consumer>
                        {(authUser) => <div>
                          <p>Welcome {firebase.auth.currentUser.displayName}!</p>
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
    } else {
      return null
    }
  }
}

const authCondition = (authUser) => !!authUser
const ListFavoritesWithRouter = withRouter(FavoritesList)
export default withAuthorization(authCondition)(withDynamicLayout(AccountPage))
