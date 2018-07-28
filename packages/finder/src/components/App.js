import React from 'react'
import withAuthentication from './withAuthentication';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Landing from '../modules/landing'
import Home from '../modules/account'
import Ubl from '../modules/ubl'
import Orp from '../modules/orp'
import Ec from '../modules/ec'
import Atomic from '../modules/atomic'
import OsdViewer from '../modules/osd-viewer'
import OsdServer from '../modules/osd-server'
import SignInPage from '../modules/login'
import * as routes from '../constants/routes';

const App = () =>
  <BrowserRouter>
    <Switch>
      <Route exact path={routes.LANDING} component={Landing}/>
      <Route exact path={routes.HOME} component={Home}/>
      <Route exact path='/ubl' component={Ubl}/>
      <Route exact path='/login' component={SignInPage}/>
      <Route exact path='/orp' component={Orp}/>
      <Route exact path='/ec' component={Ec}/>
      <Route exact path='/atomic' component={Atomic}/>
      <Route exact path='/osd' component={OsdViewer}/>
      <Route exact path='/component' component={OsdServer}/>
    </Switch>
  </BrowserRouter>

export default withAuthentication(App);
