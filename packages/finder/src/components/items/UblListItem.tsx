import * as React from "react"
import {Domain} from "../../constants"
import {AuthUserContext, ResultContext} from "../core"
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject"
import {FavoriteButton, Thumbnail, Title} from "../ui"
import {ItemProps} from "./ItemProps"
import {buildImagePreview, buildImageView, buildUBLManifestId, getSchema} from './ItemUtils'
import {ListItemDisplay} from "../ui/ListItemDisplay";

const firebase = require("firebase/app")

const extend = require("lodash/extend")

export class UblListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {viewerUrl, previewUrl, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const pathname = new URL(source['@id']).pathname
    const splitPath = pathname.split('/')
    const viewId = splitPath[1].padStart(10, '0')
    const contentUrl = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
    const firstId = viewId.substring(0, 4).padStart(4, '0')
    const secondId = viewId.substring(5, 8).padStart(4, '0')
    const imageBase = process.env.REACT_APP_UBL_IMAGE_SERVICE_BASE + firstId + '/' + secondId + '/' + viewId + '/00000001.jpx'
    const manifestId = buildUBLManifestId(imageBase)
    const viewUrl = buildImageView(viewerUrl, manifestId)
    const thumbnail = imageBase + Domain.THUMBNAIL_API_REQUEST
    const imageLink = buildImagePreview(previewUrl, imageBase, manifestId)
    const schema = getSchema(source, contentUrl, thumbnail, null)
    return (
      <ResultContext.Provider value={result}>
        <ListItemDisplay
          contentUrl={viewUrl}
          imageLink={imageLink}
          schema={schema}
          thumbnail={thumbnail}
          {...this.props}
        />
      </ResultContext.Provider>)
  }
}

export default UblListItem
