import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Ubl from './modules/ubl';
import Orp from './modules/orp';
import Ec from './modules/ec';
import './index.css';

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Ubl}/>
            <Route path='/orp' component={Orp}/>
            <Route path='/ec' component={Ec}/>
        </Switch>
    </BrowserRouter>
), document.getElementById('root'))

