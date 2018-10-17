import * as React from 'react';
import {Star} from './svg';
const firebase = require("firebase/app");

export class FavoritesListButton extends React.Component<any, any> {
  state: {
    error: null
    favorite: string
    isFavorite: boolean
    isLoaded: boolean,
  };
  authUser: {
    uid: string,
  }
  result: {
    _id: string,
  }

  unsetFavorite: (ev: React.MouseEvent<HTMLButtonElement>) => void;

  constructor(props) {
    super(props)
    this.authUser = props.authUser
    this.result = props.result
    this.unsetFavorite = props.unsetFavorite
    this.state = {
      error: null,
      favorite: null,
      isFavorite: false,
      isLoaded: false,
    }
    this.getFavorite.bind(this);
  }

  getFavorite() {
    firebase.database().ref('/users/' + this.authUser.uid + '/favorites/' + this.result._id).once('value')
      .then((snapshot) =>
        this.setState({
          favorite: (snapshot.val() && snapshot.val().result._id),
          isFavorite: true,
          isLoaded: true,
        }),
      );
  }

  componentDidMount() {
    this.getFavorite()
  }

  render() {
    const {error, isLoaded, favorite, isFavorite} = this.state
    if (error) {
      return <div>Error: {error}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className='button-right'>
        {isFavorite && favorite ?
          (<button
            aria-label='unset favorite'
            onClick={this.unsetFavorite}
            type="button"
            className="button-transparent__fav"
          >
            <Star/>
          </button>)
          : null}
      </div>)
    }
  }
}
