import React from 'react'
import {Link} from 'react-router-dom'
import {Domain, Routes} from '../../../constants'
import {AuthUserContext} from '../../auth/'
import {firebase} from '../../firebase/'

export class AuthUserTooltip extends React.Component<any, any> {

  signOut = () => {
    firebase.auth().signOut()
  }

  render() {
    if (firebase) {
      const notFoundImageUri = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
      return (
        <AuthUserContext.Consumer>
          {(authUser) => authUser ? <div>{firebase.auth().currentUser.photoURL ?
            <img className="account-image" src={firebase.auth().currentUser.photoURL} alt="Account's profile image" aria-hidden="true"/> :
            <img className="account-image" src={notFoundImageUri} alt="Account's profile image" aria-hidden="true"/>}
            <div className="gb_yb">
              <div className="gb_Bb">{firebase.auth().currentUser.displayName}</div>
              <div className="gb_Db">{firebase.auth().currentUser.email}</div>
              <Link className='btn btn-outline-secondary' to={Routes.ACCOUNT}>{Domain.ACCOUNT_TEXT}</Link>
              <button aria-label='sign out' className="btn btn-outline-secondary" onClick={this.signOut}>Sign-out
              </button>
            </div>
          </div> : null}
        </AuthUserContext.Consumer>)
    } else {
      return null
    }
  }
}
