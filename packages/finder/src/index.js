import 'babel-polyfill';
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/core/App'
import './styles/index.css'
import './styles/scss/app.scss';
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
  gtmId: 'GTM-KW98JC4',
  dataLayerName: 'schemaDataLayer',
  events: {
    imageView: 'imageView'
  }
}

TagManager.initialize(tagManagerArgs)

ReactDOM.render((
  <App/>), document.getElementById('container'))

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered: ', registration)
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}
