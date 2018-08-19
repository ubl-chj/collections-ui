import * as React from "react";
import {Domain} from "../../constants";
import {ResultContext} from "../core";
import {Title} from "./index";
import {ListFavoriteButton} from './ListFavoriteButton';
import {Thumbnail} from './Thumbnail'

const extend = require("lodash/extend")
const firebase = require("firebase/app");

export class ListFavorite extends React.Component<any, any> {

  static removeFavorite(authUserUid, result) {
    firebase.database().ref('/users/' + authUserUid + '/favorites/' + result._id).remove();
  }

  static createTitle(title) {
    return {__html: '<b>Title:</b> ' + title}
  }
  favorite: {
    result: {
      _source: {
        title: string,
        thumbnail: string,
      },
      _index: string,
    },
  }
  state: {
    error: null
    isFavorite: boolean,
  };
  authUser: {
    uid: string,
  }
  viewerUrl: string

  constructor(props) {
    super(props)
    this.favorite = props.favorite
    this.authUser = props.authUser
    this.state = {
      error: null,
      isFavorite: true,
    }
    this.viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE + '?manifest='
  }

  unsetFavorite() {
    this.setState({
      isFavorite: false,
    });
    ListFavorite.removeFavorite(this.authUser.uid, this.favorite.result)
  }

  handleMissingImage = (target) => {
    return target.src = 'https://www.e-codices.unifr.ch/img/frontend/logo-nav.png'
  }

  createAuthor = (source, bemBlocks) => {
    if (source['Author(s) of the Record']) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Author:</b> {source['Author(s) of the Record']}</h3>
    }
  }

  // TODO Harmonize the metadata labels before indexing
  renderFavoriteContent(result) {
    const source = extend({}, result._source, result.highlight)
    switch (result._index) {
      case process.env.REACT_APP_EC_INDEX:
        return (
          <div>
            <Title viewUrl={source.related} className='sk-hits-list-hit__title' titleString={source.title}/>
            <h3 className='sk-hits-list-hit__subtitle' dangerouslySetInnerHTML={ListFavorite.createTitle(source['Title (English)'])}/>
            <h3 className='sk-hits-list-hit__subtitle'><b>Date of
              Origin:</b> {source['Date of Origin (English)']}</h3>
            <h3 className='sk-hits-list-hit__subtitle' dangerouslySetInnerHTML={{__html: source['Summary (English)']}}/>
          </div>);
      case process.env.REACT_APP_UC_INDEX:
        const ucViewUrl = this.viewerUrl + source.Manifest
        return (
          <ResultContext.Provider value={result}>
            <div>
              <Title viewUrl={ucViewUrl} className='sk-hits-list-hit__title' titleString={source.Title}/>
              <h3 className='sk-hits-list-hit__subtitle'><b>Subject:</b> {source['Subject(s)']}</h3>
              <h3 className='sk-hits-list-hit__subtitle' dangerouslySetInnerHTML={{__html: source.Abstract}}/>
            </div>
          </ResultContext.Provider>);
      case process.env.REACT_APP_GETTY_INDEX:
        const gettyViewUrl = this.viewerUrl + source.id
        return (
          <ResultContext.Provider value={result}>
            <div>
              <Title viewUrl={gettyViewUrl} className='sk-hits-list-hit__title' titleString={source.title}/>
              <h3 className='sk-hits-list-hit__subtitle'><b>Object Type:</b> {source['Object Type']}</h3>
              <h3 className='sk-hits-list-hit__subtitle' dangerouslySetInnerHTML={{__html: source.Inscription}}/>
            </div>
          </ResultContext.Provider>);
      case process.env.REACT_APP_HARVARD_INDEX:
        const harvardViewUrl = this.viewerUrl + source.manifest
        return (
          <ResultContext.Provider value={result}>
            <div>
              <Title viewUrl={harvardViewUrl} className='sk-hits-list-hit__title' titleString={source.title}/>
              <h3 className='sk-hits-list-hit__subtitle'><b>Creator:</b> {source.People}</h3>
              <h3 className='sk-hits-list-hit__subtitle'><b>Classification:</b> {source.Classification}</h3>
            </div>
          </ResultContext.Provider>);
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
    const thumbnail = result._source.thumbnail
    if (this.favorite.result._index === process.env.REACT_APP_GETTY_INDEX) {
      const imageBase = thumbnail.split('/full')[0]
      imageSource = thumbnail
      imageLink = previewUrl + '?image=' + imageBase
    } else {
      imageSource = thumbnail + Domain.THUMBNAIL_API_REQUEST
      imageLink = previewUrl + '?image=' + result._source.thumbnail
    }
    if (error) {
      return <div>Error: {error}</div>;
    } else {
      return (isFavorite ?
        <div className='sk-hits-list-hit sk-hits-list__item'>
          <ResultContext.Provider value={result}>
            <Thumbnail imageWidth={140} className="sk-hits-list-hit__poster" imageSource={imageSource} imageLink={imageLink}/>
          </ResultContext.Provider>
          <div className='sk-hits-list-hit__details'>
            <ListFavoriteButton authUser={this.authUser} result={result} unsetFavorite={this.unsetFavorite.bind(this)}/>
            {this.renderFavoriteContent(result)}
          </div>
        </div> : null)
    }
  }
}
