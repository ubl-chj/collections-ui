import {AuthUserContext, firebase, NavMenu, withAuthorization, withDynamicLayout} from 'collections-ui-common'
import React from 'react'
import {withRouter} from 'react-router-dom'
import {
  ActionBar,
  Layout,
  LayoutBody,
  LayoutResults,
  SearchkitManager,
  SearchkitProvider,
  SideBar
} from 'searchkit-fork'
import {FavoritesList, Head} from '../ui'
import {IRouteProps} from './IRouteProps'

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
    isMobile: boolean,
  }

  constructor(props) {
    super(props)
    this.routeKey = this.props.routeConfig.indexName
    const host = props.host + this.routeKey
    this.searchkit = new SearchkitManager(host, props.options)
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
    if (firebase) {
      const {routeConfig} = this.props
      const {isMobile} = this.state
      return (
        <SearchkitProvider searchkit={this.searchkit}>
          <div style={{background: '#efefef'}} id='outer'>
            <NavMenu/>
            <div id='inner'>
              <Layout>
                <Head isMobile={isMobile} routeConfig={routeConfig}/>
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
