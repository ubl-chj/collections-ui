import * as React from 'react'

import {firebase} from '../firebase'
import {AuthTokenContext} from './AuthTokenContext'

export const withIdToken = (Component) =>
  class WithAuthenticationToken extends React.Component<any, any> {
    state: { idTokenResult: object }

    constructor(props) {
      super(props);
      this.state = {
        idTokenResult: null,
      }
    }

    componentDidMount() {
      firebase.auth.onAuthStateChanged((authUser) => {
        authUser
          ? firebase.auth.currentUser.getIdTokenResult().then((idTokenResult) => {
            this.setState({idTokenResult})
          })
          : this.setState({idTokenResult: null})
      })
    }

    render() {
      const {idTokenResult} = this.state;

      return (
        <AuthTokenContext.Provider value={idTokenResult}>
          <Component {...this.props}/>
        </AuthTokenContext.Provider>
      )
    }
  }
