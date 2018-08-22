import * as React from "react";
import {block} from 'searchkit-fork'
import {Domain} from "../../constants";
import {ResultContext} from "../core";
import {buildImageView, resolveManifestId, resolveThumbnail, resolveThumbnailSource} from "../items";
import {getSchema} from "../items";
import {buildImagePreview} from "../items";
import {FavoritesListItemDisplay} from "./FavoritesListItemDisplay";

const extend = require("lodash/extend")
const firebase = require("firebase/app");

export class FavoriteListItem extends React.Component<any, any> {

  static defaultProps = {
    mod: "sk-hits-list",
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  static removeFavorite(authUserUid, result) {
    firebase.database().ref('/users/' + authUserUid + '/favorites/' + result._id).remove();
  }

  favorite: {
    result: any,
  }
  state: {
    error: null
    isFavorite: boolean,
  };
  authUser: {
    uid: string,
  }

  constructor(props) {
    super(props)
    this.favorite = props.favorite
    this.authUser = props.authUser
    this.state = {
      error: null,
      isFavorite: true,
    }
  }

  unsetFavorite() {
    this.setState({
      isFavorite: false,
    });
    FavoriteListItem.removeFavorite(this.authUser.uid, this.favorite.result)
  }

  renderFavoriteContent(bemBlocks, result) {
    const source = extend({}, result._source, result.highlight)
    const {previewUrl, viewerUrl} = this.props
    const manifestId = resolveManifestId(source)

    // hack around Getty level 0
    let thumbnailSource
    let thumbnail
    if (result._index !== process.env.REACT_APP_GETTY_INDEX) {
      thumbnailSource = resolveThumbnailSource(source)
      thumbnail = resolveThumbnail(thumbnailSource)
    } else {
      thumbnailSource = source.thumbnail.split('/full')[0]
      thumbnail = source.thumbnail
    }

    const imageLink = buildImagePreview(previewUrl, thumbnailSource, manifestId)
    const viewUrl = buildImageView(viewerUrl, manifestId)
    const schema = getSchema(source, manifestId, thumbnailSource, source.imageIndex)
    if (viewUrl && schema && imageLink && thumbnail) {
      return (
        <ResultContext.Provider value={result}>
          <FavoritesListItemDisplay
            contentUrl={viewUrl}
            imageLink={imageLink}
            schema={schema}
            thumbnail={thumbnail}
            bemBlocks={bemBlocks}
            result={result}
            unsetFavorite={this.unsetFavorite.bind(this)}
            {...this.props}
          />
        </ResultContext.Provider>)
    } else {
      return ("Metadata Display not Defined")
    }
  }

  render() {
    const {mod} = this.props
    const bemBlocks = {
      container: block(mod).el,
      item: block(`${mod}-hit`).el,
    }
    const {error, isFavorite} = this.state
    const result = this.favorite.result
    if (error) {
      return <div>Error: {error}</div>;
    } else {
      return (
        isFavorite ? this.renderFavoriteContent(bemBlocks, result)
        : null
      )
    }
  }
}
