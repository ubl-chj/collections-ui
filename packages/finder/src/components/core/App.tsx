import * as React from "react";

import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Landing from '../../routes/landing'
import Account from '../../routes/account'
import Ubl from '../../routes/ubl'
import Orp from '../../routes/orp'
import Ec from '../../routes/ec'
import Atomic from '../../routes/atomic'
import OsdViewer from '../../routes/osd-viewer'
import OsdServer from '../../routes/osd-server'
import SignIn from '../../routes/signin'
import * as routes from '../../constants/routes';
import {withAuthentication} from "./withAuthentication";

const App = () =>
  <BrowserRouter>
    <Switch>
      <Route exact path={routes.LANDING} component={Landing}/>
      <Route exact path={routes.ACCOUNT} component={Account}/>
      <Route exact path='/ubl' component={Ubl}/>
      <Route exact path={routes.SIGN_IN} component={SignIn}/>
      <Route exact path='/orp' component={Orp}/>
      <Route exact path='/ec' component={Ec}/>
      <Route exact path='/atomic' component={Atomic}/>
      <Route exact path='/osd' component={OsdViewer}/>
      <Route exact path='/component' component={OsdServer}/>
    </Switch>
  </BrowserRouter>

export default withAuthentication(App);
