import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Ubl from './modules/ubl';
import Orp from './modules/orp';
import Ec from './modules/ec';
import Atomic from './modules/atomic';
import OsdViewer from './modules/osd-viewer';
import OsdComponent from './modules/osd-component';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Ubl}/>
            <Route path='/orp' component={Orp}/>
            <Route path='/ec' component={Ec}/>
            <Route path='/atomic' component={Atomic}/>
            <Route path='/osd' component={OsdViewer}/>
            <Route path='/component' component={OsdComponent}/>
        </Switch>
    </BrowserRouter>
), document.getElementById('container'))

