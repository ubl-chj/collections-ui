import React from 'react'

import {firebase} from '../firebase'
import {AuthUserContext} from './AuthUserContext'

export const withAuthentication = (Component) =>
  class WithAuthentication extends React.Component<any, any> {
    state: { authUser: object }

    constructor(props) {
      super(props);
      this.state = {
        authUser: null,
      }
    }

    componentDidMount() {
      firebase.auth().onAuthStateChanged((authUser) => {
        authUser
          ? this.setState({authUser})
          : this.setState({authUser: null});
      })
    }

    render() {
      const {authUser} = this.state;

      return (
        <AuthUserContext.Provider value={authUser}>
          <Component {...this.props}/>
        </AuthUserContext.Provider>
      )
    }
  }
