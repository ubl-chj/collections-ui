import * as React from "react";
import { withRouter } from 'react-router-dom';

import { AuthUserContext } from './AuthUserContext';
import { firebase } from '../../firebase';
import {Routes} from '../../constants';

export const withAuthorization = (authCondition) => (Component) => {
  class WithAuthorization extends React.Component<any> {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          this.props.history.push(Routes.SIGN_IN);
        }
      });
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => authUser ? <Component /> : null}
        </AuthUserContext.Consumer>
      );
    }
  }

  return withRouter(WithAuthorization);
}


