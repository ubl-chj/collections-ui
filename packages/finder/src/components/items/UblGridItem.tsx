import * as React from "react"
import {Domain} from "../../constants"
import {GridItemDisplay} from "../ui/GridItemDisplay";
import {ItemProps} from "./ItemProps"
import {buildImagePreview, buildUBLManifestId, getSchema, shortenTitle} from './ItemUtils'

const extend = require("lodash/extend")

export class UblGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {previewUrl, result} = this.props

    const source = extend({}, result._source, result.highlight)
    const pathname = new URL(source['@id']).pathname
    const splitPath = pathname.split('/')
    const viewId = splitPath[1].padStart(10, '0')
    const contentUrl = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
    const firstId = viewId.substring(0, 4).padStart(4, '0')
    const secondId = viewId.substring(5, 8).padStart(4, '0')
    const imageBase = process.env.REACT_APP_UBL_IMAGE_SERVICE_BASE + firstId + '/' + secondId + '/' + viewId + '/00000001.jpx'
    const manifestId = buildUBLManifestId(imageBase)
    const thumbnail = imageBase + Domain.THUMBNAIL_API_REQUEST
    const imageLink = buildImagePreview(previewUrl, imageBase, manifestId)
    const schema = getSchema(source, contentUrl, thumbnail, null)
    const titleString = shortenTitle(source.Title)
    return (
      <GridItemDisplay
        contentUrl={contentUrl}
        imageLink={imageLink}
        schema={schema}
        thumbnail={thumbnail}
        titleString={titleString}
        {...this.props}
      />
    )
  }
}

export default UblGridItem
