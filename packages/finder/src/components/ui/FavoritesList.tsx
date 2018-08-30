import * as React from "react";
import {AuthUserContext} from "../core";
import {FavoriteListItem} from './FavoriteListItem'
const firebase = require("firebase/app");

export class FavoritesList extends React.Component<any, any> {
  state: {
    error: null
    favorites: any[]
    isFavorite: boolean
    isLoaded: boolean,
  };
  authUser: {
    uid: string,
  }

  constructor(props) {
    super(props)
    this.authUser = props.authUser
    this.state = {
      error: null,
      favorites: null,
      isFavorite: false,
      isLoaded: false,
    }
    this.getFavorites.bind(this);
  }

  getFavorites() {
    firebase.database().ref('/users/' + this.authUser.uid + '/favorites').once('value')
      .then((snapshot) =>
        this.setState({
          favorites: (this.snapshotToArray(snapshot)),
          isFavorite: true,
          isLoaded: true,
        }),
      );
  }

  snapshotToArray(snapshot) {
    const returnArr = []
    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val()
      item.key = childSnapshot.key
      returnArr.push(item)
    })
    return returnArr;
  }

  componentDidMount() {
    this.getFavorites()
  }

  buildFavoritesList(favorites) {
    const favs = favorites.sort((a, b) => {
        const sortA = a.result.timestamp
        const sortB = b.result.timestamp
        if (sortA < sortB) {
          return 1;
        }
        if (sortA > sortB) {
          return -1;
        }
        return 0;
    })
    return favs.map((favorite) => {
      return (
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
            <FavoriteListItem key={favorite.key} favorite={favorite} authUser={authUser}/> : null}
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
