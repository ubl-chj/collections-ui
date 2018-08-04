import * as React from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Atomic, Ec, Landing, Orp, Previewer, Ubl, Uc, Viewer} from '../routes'
import Account from '../routes/Account'
import SignIn from '../routes/Signin'
import {Routes} from '../../constants'
import {withAuthentication} from "./withAuthentication";

const App = () =>
  <BrowserRouter>
    <Switch>
      <Route exact path={Routes.LANDING} component={Landing}/>
      <Route exact path={Routes.ACCOUNT} component={Account}/>
      <Route exact path={Routes.SIGN_IN} component={SignIn}/>
      <Route exact path='/atomic' component={Atomic}/>
      <Route exact path='/component' component={Viewer}/>
      <Route exact path='/ec' component={Ec}/>
      <Route exact path='/orp' component={Orp}/>
      <Route exact path='/osd' component={Previewer}/>
      <Route exact path='/ubl' component={Ubl}/>
      <Route exact path='/uc' component={Uc}/>
    </Switch>
  </BrowserRouter>

export default withAuthentication(App);
