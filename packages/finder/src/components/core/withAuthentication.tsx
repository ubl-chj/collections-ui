import * as React from "react";

import {AuthUserContext} from './AuthUserContext';
import {firebase} from '../../firebase';

export const withAuthentication = (Component) =>
  class WithAuthentication extends React.Component<any> {
    state: { authUser: Object }

    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState({authUser})
          : this.setState({authUser: null});
      });
    }

    render() {
      const {authUser} = this.state;

      return (
        <AuthUserContext.Provider value={authUser}>
          <Component/>
        </AuthUserContext.Provider>
      );
    }
  }


