import * as React from "react";
import {Thumbnail} from './Thumbnail'

const firebase = require("firebase/app");
const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE + '?manifest='

export class ListFavorite extends React.Component<any, any> {
  favorite: {
    result: {
      _source: {
        title: string
      },
      _index: string
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

  static createTitle(title) {
    return {__html: '<b>Title:</b> ' + title}
  }

  createAuthor = (source, bemBlocks) => {
    if (source['Author(s) of the Record']) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Author:</b> {source['Author(s) of the Record']}</h3>
    }
  }

  //TODO Harmonize the metadata labels before indexing
  static renderFavoriteContent(result) {
    switch (result._index) {
      case process.env.REACT_APP_EC_INDEX:
        return (
          <div>
            <a href={result._source['related']} target='_blank' rel='noopener noreferrer'>
              <h2 className='sk-hits-list-hit__title'
                dangerouslySetInnerHTML={{__html: result._source.title}}/>
            </a>
            <h3 className='sk-hits-list-hit__subtitle'
              dangerouslySetInnerHTML={ListFavorite.createTitle(result._source['Title (English)'])}/>
            <h3 className='sk-hits-list-hit__subtitle'><b>Date of
              Origin:</b> {result._source['Date of Origin (English)']}</h3>
            <h3 className='sk-hits-list-hit__subtitle'
              dangerouslySetInnerHTML={{__html: result._source['Summary (English)']}}/>
          </div>);
      case process.env.REACT_APP_UC_INDEX:
        const ucViewUrl = viewerUrl + result._source['Manifest']
        return (
          <div>
            <a href={ucViewUrl} target='_blank' rel='noopener noreferrer'>
              <h2 className='sk-hits-list-hit__title'
                dangerouslySetInnerHTML={{__html: result._source.Title}}/>
            </a>
            <h3 className='sk-hits-list-hit__subtitle'><b>Subject:</b> {result._source['Subject(s)']}</h3>
            <h3 className='sk-hits-list-hit__subtitle'
              dangerouslySetInnerHTML={{__html: result._source['Abstract']}}/>
          </div>);
      case process.env.REACT_APP_GETTY_INDEX:
        const gettyViewUrl = viewerUrl + result._source['id']
        return (
          <div>
            <a href={gettyViewUrl} target='_blank' rel='noopener noreferrer'>
              <h2 className='sk-hits-list-hit__title'
                dangerouslySetInnerHTML={{__html: result._source.title}}/>
            </a>
            <h3 className='sk-hits-list-hit__subtitle'><b>Object Type:</b> {result._source['Object Type']}</h3>
            <h3 className='sk-hits-list-hit__subtitle'
              dangerouslySetInnerHTML={{__html: result._source['Inscription']}}/>
          </div>);
      default:
        return 'Item Metadata Display Not Defined';
    }
  }

  render() {
    const {error, isFavorite} = this.state
    const result = this.favorite.result
    const previewUrl = process.env.REACT_APP_OSD_BASE
    let imageSource
    let imageLink
    const thumbnail = result._source['thumbnail']
    if (this.favorite.result._index ===  process.env.REACT_APP_GETTY_INDEX) {
      const imageBase = thumbnail.split('/full')[0]
      imageSource = thumbnail
      imageLink = previewUrl + '?image=' + imageBase
    } else {
      imageSource = thumbnail + '/full/90,/0/default.jpg'
      imageLink = previewUrl + '?image=' + result._source['thumbnail']
    }
    if (error) {
      return <div>Error: {error}</div>;
    } else {
      return (isFavorite ?
        <div className='sk-hits-list-hit sk-hits-list__item'>
          <Thumbnail imageWidth={140} className="sk-hits-list-hit__poster" imageSource={imageSource}
            imageLink={imageLink}/>
          <div className='sk-hits-list-hit__details'>
            <ListFavoriteItem authUser={this.authUser} result={result}
              unsetFavorite={this.unsetFavorite.bind(this)}/>
            {ListFavorite.renderFavoriteContent(result)}
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
