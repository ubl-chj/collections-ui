import * as React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {ActionBar, Layout, LayoutBody, LayoutResults, SearchBox, SearchkitManager, SearchkitProvider, SideBar, TopBar} from 'searchkit-fork'
import {Domain, Routes} from '../../constants';
import {AuthUserContext, withAuthorization, withDynamicLayout} from '../core'
import {AuthProfile, BMenu, FavoritesList, Logo} from '../ui'

const firebase = require("firebase/app")
const host = process.env.REACT_APP_ELASTICSEARCH_HOST + process.env.REACT_APP_ATOMIC_INDEX
const options = {timeout: 20000}
const searchkit = new SearchkitManager(host, options)

const queryFields = []

export class AccountPage extends React.Component<any, any> {

  state: {
    width: number,
  }

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
      return (
        <SearchkitProvider searchkit={searchkit}>
          <div id='outer-container'>
            <BMenu/>
            <div id='page-wrap'>
              <Layout>
                <TopBar>
                  <div className='my-logo'>
                    <Link className='my-logo' to={Routes.LANDING}>
                      <Logo className='JUQOtf'/>
                      <span className='JUQOtq'>{Domain.LOGO_TEXT}</span>
                    </Link>
                  </div>
                  <SearchBox autofocus={true} searchOnChange={true} queryFields={queryFields}/>
                  <AuthProfile width={width}/>
                </TopBar>
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
