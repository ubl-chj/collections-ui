import * as React from "react";
import {ListFavorite} from './ListFavorite'
import {AuthUserContext} from "../core";
const firebase = require("firebase/app");

export class ListFavorites extends React.Component<any, any> {
  state: {
    error: null
    favorites: Array<any>
    isFavorite: boolean
    isLoaded: boolean
  };
  authUser: {
    uid: string
  }

  constructor(props) {
    super(props)
    this.authUser = props.authUser
    this.state = {
      error: null,
      favorites: null,
      isLoaded: false,
      isFavorite: false
    }
    this.getFavorites.bind(this);
  }

  getFavorites() {
    firebase.database().ref('/users/' + this.authUser.uid + '/favorites').once('value')
      .then((snapshot) =>
        this.setState({
          isLoaded: true,
          favorites: (this.snapshotToArray(snapshot)),
          isFavorite: true
        })
      );
  }

  snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      returnArr.push(item);
    });

    return returnArr;
  };

  componentDidMount() {
    this.getFavorites()
  }

  buildFavoritesList(favorites) {
    const favs = favorites.sort(function(a, b) {
        const sortA = a.result.timestamp
        const sortB = b.result.timestamp
        if (sortA < sortB) {
          return -1;
        }
        if (sortA > sortB) {
          return 1;
        }
      return 0;
    })
    return favs.map(function (favorite) {
      return (
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
            <ListFavorite key={favorite.key} favorite={favorite} authUser={authUser}/>: null}
        </AuthUserContext.Consumer>)
    })
  }

  render() {
    const {error, isLoaded, favorites} = this.state
    if (error) {
      return <div>Error: {error}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>{this.buildFavoritesList(favorites)}
        </div>
      )
    }
  }
}


