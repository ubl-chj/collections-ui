import {buildImagePreview, buildImageView, buildThumbnailReference, firebase, getSchema, resolveManifestId,
  ResultContext} from 'collections-ui-common'
import * as React from "react"
import {block} from 'searchkit-fork'
import {FavoritesListItemDisplay} from "./FavoritesListItemDisplay"
const extend = require("lodash/extend")

export class FavoriteListItem extends React.Component<any, any> {

  static defaultProps = {
    mod: "sk-hits-list",
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  static removeFavorite(authUserUid, result) {
    if (firebase) {
      firebase.db.ref('/users/' + authUserUid + '/favorites/' + result._id).remove();
    }
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

  unsetFavorite = () => {
    this.setState({
      isFavorite: false,
    });
    FavoriteListItem.removeFavorite(this.authUser.uid, this.favorite.result)
  }

  renderFavoriteContent(bemBlocks, result) {
    const source = extend({}, result._source, result.highlight)
    const {viewerUrl} = this.props
    const manifestId = resolveManifestId(source)

    const thumbnail = buildThumbnailReference(source.thumbnail)
    if (thumbnail) {
      const viewUrl = buildImageView(viewerUrl, manifestId)
      const schema = getSchema(source, manifestId, thumbnail, source.imageIndex)
      if (viewUrl && schema && thumbnail) {
        return (
          <ResultContext.Provider value={result}>
            <FavoritesListItemDisplay
              contentUrl={viewUrl}
              imageLink={viewUrl}
              schema={schema}
              thumbnail={thumbnail}
              bemBlocks={bemBlocks}
              result={result}
              unsetFavorite={this.unsetFavorite}
              {...this.props}
            />
          </ResultContext.Provider>)
      } else {
        return ("Metadata Display not Defined")
      }
    } else {
      return null
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
