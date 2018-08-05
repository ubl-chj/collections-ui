import * as React from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Landing, Previewer, SignIn, Viewer} from '../routes'
import Account from '../routes/Account'
import Collection from '../routes/Collection'
import {Routes} from '../../constants'
import {withAuthentication} from "./withAuthentication";

const App = () =>
  <BrowserRouter>
    <Switch>
      <Route exact path={Routes.LANDING} component={Landing}/>
      <Route exact path={Routes.ACCOUNT} component={Account}/>
      <Route exact path={Routes.SIGN_IN} component={SignIn}/>
      <Route exact path='/collection/:id' component={Collection}/>
      <Route exact path='/component' component={Viewer}/>
      <Route exact path='/osd' component={Previewer}/>
    </Switch>
  </BrowserRouter>

export default withAuthentication(App);
