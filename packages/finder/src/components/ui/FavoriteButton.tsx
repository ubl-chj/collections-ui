import * as React from "react";

const firebase = require("firebase/app");

export class FavoriteButton extends React.Component<any, any> {

  static writeFavorite(authUserUid, result) {
    result.timestamp = new Date().getTime()
    firebase.database().ref('/users/' + authUserUid + '/favorites/' + result._id).set({
      result,
    });
  }

  static removeFavorite(authUserUid, result) {
    firebase.database().ref('/users/' + authUserUid + '/favorites/' + result._id).remove();
  }
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
  _isMounted: boolean

  constructor(props) {
    super(props)
    this.authUser = props.authUser
    this.result = props.result
    this.state = {
      error: null,
      favorite: null,
      isLoaded: false,
      isFavorite: false,
    }
    this.getFavorite.bind(this);
  }

  getFavorite() {
    firebase.database().ref('/users/' + this.authUser.uid + '/favorites/' + this.result._id).once('value')
      .then((snapshot) =>
        this.setState({
          isLoaded: true,
          favorite: (snapshot.val() && snapshot.val().result._id),
          isFavorite: true,
        }),
      );
  }

  componentDidMount() {
    this.getFavorite()
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  setFavorite(result) {
    if (this._isMounted) {
      this.setState({
        isFavorite: true,
        favorite: result._id,
      });
    }
  }

  unsetFavorite() {
    if (this._isMounted) {
      this.setState({
        isFavorite: false,
      });
    }
  }

  render() {
    const {error, isLoaded, favorite, isFavorite} = this.state
    if (error) {
      return <div>Error: {error}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className='result-item-actions layout-row'>
        {isFavorite && favorite ?
          (
            <button type="button" className="btn btn-primary-outline btn-xs">
            <a id={this.result._id}>
              <i
                className="favorite-button glyphicon-star"
                onClick={() => {
                FavoriteButton.removeFavorite(this.authUser.uid, this.result);
                this.unsetFavorite()
              }}
              />
            </a>
            </button>)
          : (
            <button type="button" className="btn btn-primary-outline btn-xs"><a id={this.result._id}>
            <i
              className="favorite-button glyphicon-star-empty"
              onClick={() => {
              FavoriteButton.writeFavorite(this.authUser.uid, this.result);
              this.setFavorite(this.result)
            }}
            />
          </a>
          </button>)
        }
      </div>)
    }
  }
}
