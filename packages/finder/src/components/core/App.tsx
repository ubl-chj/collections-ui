import * as React from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Routes} from '../../constants'
import {Landing, Previewer, SignIn, Viewer} from '../routes'
import Account from '../routes/Account'
import Collection from '../routes/Collection'
import {withAuthentication} from './withAuthentication'
import {withDynamicLayout} from './withDynamicLayout'

class App extends React.Component<any> {

  render() {
    const supportsHistory = 'pushState' in window.history
    const t = Boolean(true)
    return (
        <BrowserRouter forceRefresh={!supportsHistory}>
            <Switch>
              <Route exact={t} path={Routes.LANDING} component={withDynamicLayout(Landing)}/>
              <Route exact={t} path={Routes.ACCOUNT} component={Account}/>
              <Route exact={t} path={Routes.SIGN_IN} component={SignIn}/>
              <Route exact={t} path='/collection/:id' component={withDynamicLayout(Collection)}/>
              <Route exact={t} path='/view/:uuid' component={withDynamicLayout(Viewer)}/>
              <Route exact={t} path='/preview/:uuid?' component={withDynamicLayout(Previewer)}/>
            </Switch>
         </BrowserRouter>)
  }
}

export default withAuthentication(App);
