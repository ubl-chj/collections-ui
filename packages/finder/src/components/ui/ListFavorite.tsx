import {AuthUserContext} from "../core";
import * as React from "react";

const firebase = require("firebase/app");

export class ListFavorite extends React.Component<any, any> {
  favorite: {
    result: {
      _source: {
        title: string
      }
    }
  }
  state: {
    error: null
    isFavorite: boolean
  };
  authUser: {
    uid: string
  }

  constructor(props) {
    super(props)
    this.favorite = props.favorite
    this.authUser = props.authUser
    this.state = {
      error: null,
      isFavorite: true
    }
  }

  unsetFavorite() {
    this.setState({
      isFavorite: false,
    });
    ListFavorite.removeFavorite(this.authUser.uid, this.favorite.result)
  }

  static removeFavorite(authUserUid, result) {
    firebase.database().ref('/users/' + authUserUid + '/favorites/' + result._id).remove();
  }

  handleMissingImage = (target) => {
    return target.src = 'https://www.e-codices.unifr.ch/img/frontend/logo-nav.png'
  }

  static createTitle(source) {
    const title = source['Title (English)']
    return {__html: '<b>Title:</b> ' + title}
  }

  render() {
    const {error, isFavorite} = this.state
    const result = this.favorite.result
    const osdUrl = process.env.REACT_APP_OSD_BASE
    const thumbnail = result._source['thumbnail'] + '/full/90,/0/default.jpg'
    const thumbUrl = osdUrl + '?image=' + result._source['thumbnail']
    const url = result._source['related']
    if (error) {
      return <div>Error: {error}</div>;
    } else {
      return (isFavorite ?
        <div className='sk-hits-list-hit sk-hits-list__item'>
          <div className='sk-hits-list-hit__poster'>
            <a href={thumbUrl} target='_blank' rel='noopener noreferrer'>
              <img onError={(e) => {
                this.handleMissingImage(e.target as HTMLImageElement)
              }} alt='e-codices' src={thumbnail}/>
            </a>
          </div>
          <div className='sk-hits-list-hit__details'>
                <ListFavoriteItem authUser={this.authUser} result={result}
                  unsetFavorite={this.unsetFavorite.bind(this)}/>
            <a href={url} target='_blank' rel='noopener noreferrer'>
              <h2 className='sk-hits-list-hit__title'
                dangerouslySetInnerHTML={{__html: result._source.title}}/>
            </a>
            <h3 className='sk-hits-list-hit__subtitle'
              dangerouslySetInnerHTML={ListFavorite.createTitle(result._source)}/>
            <h3 className='sk-hits-list-hit__subtitle'><b>Date of
              Origin:</b> {result._source['Date of Origin (English)']}</h3>
            <h3 className='sk-hits-list-hit__subtitle'
              dangerouslySetInnerHTML={{__html: result._source['Summary (English)']}}/>
          </div>
        </div> : null)
    }
  }
}

export class ListFavoriteItem extends React.Component<any, any> {
  state: {
    error: null
    favorite: string
    isFavorite: boolean
    isLoaded: boolean
  };
  authUser: {
    uid: string
  }
  result: {
    _id: string
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
      isLoaded: false,
      isFavorite: false
    }
    this.getFavorite.bind(this);
  }

  getFavorite() {
    firebase.database().ref('/users/' + this.authUser.uid + '/favorites/' + this.result._id).once('value')
      .then((snapshot) =>
        this.setState({
          isLoaded: true,
          favorite: (snapshot.val() && snapshot.val().result._id),
          isFavorite: true
        })
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
      return (<div className='result-item-actions layout-row'>
        {isFavorite && favorite ?
          (<button type="button" className="btn btn-primary-outline btn-xs">
            <a id={this.result._id}>
              <i className="glyphicon glyphicon-star" onClick={this.unsetFavorite}/></a>
          </button>)
          : null}
      </div>)
    }
  }
}
