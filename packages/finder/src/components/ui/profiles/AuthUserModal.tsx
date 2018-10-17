import * as React from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'
import {Routes} from '../../../constants'
import {AuthUserContext} from "../../core";

const firebase = require("firebase/app");

export const AuthUserModal = (props) => {
  const {isOpen, toggle, className} = props
  return (
    <Modal isOpen={isOpen} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle}>Profile</ModalHeader>
      <ModalBody>
        <AuthUserContext.Consumer>
          {(authUser) => authUser ? <div>
            <img
              className="account-image-profile"
              src={firebase.auth().currentUser.photoURL}
              alt="Account's profile image"
              aria-hidden="true"
            />
            <div className="gb_yb">
              <div className="gb_Bb">{firebase.auth().currentUser.displayName}</div>
              <div className="gb_Db">{firebase.auth().currentUser.email}</div>
              <a className="btn btn-outline-secondary" href={Routes.ACCOUNT}>Account</a>
            </div>
          </div> : null}
        </AuthUserContext.Consumer>
      </ModalBody>
      <ModalFooter>
        <a
          aria-label='sign out'
          role="button"
          className="btn btn-outline-secondary"
          onClick={() => firebase.auth().signOut()}>Sign-out
        </a>
        <Button aria-label='toggle modal' color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>)
}
