import {Routes, withAuthentication, withDynamicLayout, withIdToken} from 'collections-ui-common'
import {Previewer, Viewer} from 'manifest-viewer'
import React, {ReactElement} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import '../../styles/index.css'
import {Help, Landing, Services, SignIn} from '../routes'
import Account from '../routes/Account'
import Collection from '../routes/Collection'
import Settings from '../routes/Settings'

const App: React.FC<any> = (): ReactElement => {
    const supportsHistory = 'pushState' in window.history
    const t = Boolean(true)
    return (
      <BrowserRouter forceRefresh={!supportsHistory}>
        <Switch>
          <Route component={Account} exact={t} path={Routes.ACCOUNT}/>
          <Route component={withDynamicLayout(Help)} exact={t} path={Routes.HELP}/>
          <Route component={withDynamicLayout(Landing)} exact={t} path={Routes.LANDING}/>
          <Route component={withDynamicLayout(Services)} exact={t} path={Routes.SERVICES}/>
          <Route component={Settings} exact={t} path={Routes.SETTINGS}/>
          <Route component={SignIn} exact={t} path={Routes.SIGN_IN}/>
          <Route component={withDynamicLayout(Collection)} exact={t} path='/collection/:id'/>
          <Route
            component={(props) => (
              <Viewer
                timestamp={new Date().toString()}
                {...props}
              />
            )}
            exact={t}
            path='/view/:uuid?'
          />
          <Route component={withDynamicLayout(Previewer)} exact={t} path='/preview/:uuid?'/>
        </Switch>
      </BrowserRouter>)
}

export default withAuthentication(withIdToken(App));
