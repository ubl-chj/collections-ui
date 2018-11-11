import {Routes, withAuthentication, withDynamicLayout} from 'collections-ui-common'
import {Previewer, Viewer} from 'manifest-viewer'
import * as React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import '../../styles/index.css'
import {Help, Landing, Services, SignIn} from '../routes'
import Account from '../routes/Account'
import Collection from '../routes/Collection'
import Settings from '../routes/Settings'

class App extends React.Component<any> {

  render() {
    const supportsHistory = 'pushState' in window.history
    const t = Boolean(true)
    return (
        <BrowserRouter forceRefresh={!supportsHistory}>
            <Switch>
              <Route exact={t} path={Routes.ACCOUNT} component={Account}/>
              <Route exact={t} path={Routes.HELP} component={withDynamicLayout(Help)}/>
              <Route exact={t} path={Routes.LANDING} component={withDynamicLayout(Landing)}/>
              <Route exact={t} path={Routes.SERVICES} component={withDynamicLayout(Services)}/>
              <Route exact={t} path={Routes.SETTINGS} component={Settings}/>
              <Route exact={t} path={Routes.SIGN_IN} component={SignIn}/>
              <Route exact={t} path='/collection/:id' component={withDynamicLayout(Collection)}/>
              <Route
                exact={t}
                path='/view/:uuid?'
                component={(props) => (
                <Viewer
                  timestamp={new Date().toString()}
                  {...props}
                />
              )}
              />
              <Route exact={t} path='/preview/:uuid?' component={withDynamicLayout(Previewer)}/>
            </Switch>
         </BrowserRouter>)
  }
}

export default withAuthentication(App);
