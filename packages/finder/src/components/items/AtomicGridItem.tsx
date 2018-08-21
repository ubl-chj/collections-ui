import * as React from "react";
import {Domain} from '../../constants'
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {Thumbnail, Title} from "../ui";
import {ItemProps} from './ItemProps'
import {buildImagePreview, buildUBLViewId, getSchema, shortenTitle} from './ItemUtils'
const extend = require("lodash/extend")

export class AtomicGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const viewerUrl = process.env.REACT_APP_UBL_IMAGE_VIEWER_BASE
    const {result, bemBlocks, previewUrl} = this.props
    if (result) {
      const source = extend({}, result._source, result.highlight)
      const thumbnail = source.iiifService + Domain.THUMBNAIL_API_REQUEST
      const imageLink = buildImagePreview(previewUrl, source.iiifService)
      const viewId = buildUBLViewId(source.iiifService)
      const contentUrl = viewerUrl + viewId
      const schema = getSchema(result, contentUrl, thumbnail, source.imageIndex)
      const titleString = shortenTitle(schema.mainEntity.name)
      return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={titleString}/>
          <StructuredDataImageObject schema={schema}/>
        </div>
      )
    } else {
      return null
    }
  }
}

export default AtomicGridItem;
