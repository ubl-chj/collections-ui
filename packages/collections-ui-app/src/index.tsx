export * from './components'
import 'babel-polyfill'
import './styles/index.css'
import './styles/scss/app.scss'
import App from './components/core/App'
import React from 'react'
import ReactDOM from 'react-dom'
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
  dataLayerName: 'schemaDataLayer',
  events: {
    imageView: 'imageView'
  },
  gtmId: 'GTM-KW98JC4',
}

TagManager.initialize(tagManagerArgs)

ReactDOM.render((<App/>), document.getElementById('container'))

if (window.navigator && navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations()
    .then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    })
}
