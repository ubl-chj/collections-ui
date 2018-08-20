import * as React from "react";
import {Domain} from "../../constants";
import {ResultContext} from "../core";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {Thumbnail, Title} from "../ui";
import {ItemProps} from './ItemProps'
import {buildImagePreview, buildImageView, getSchema, shortenTitle} from './ItemUtils';
const extend = require("lodash/extend")

export class StandardGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  buildGridItem() {
    const {result, bemBlocks, previewUrl, viewerUrl} = this.props
    if (result) {
      const source = extend({}, result._source, result.highlight)
      const contentUrl = source.identifier.manifest
      let thumbnail
      if (source.thumbnail) {
        thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
      } else {
        thumbnail = source.thumbnail
      }
      const schema = getSchema(result, contentUrl, thumbnail, null)
      if (thumbnail) {
        const previewLink = buildImagePreview(previewUrl, thumbnail, contentUrl)
        const viewLink = buildImageView(viewerUrl, contentUrl)
        const titleString = shortenTitle(schema.mainEntity.name)
        return (
          <ResultContext.Provider value={result}>
            <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
              <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={previewLink} className={bemBlocks.item('poster')}/>
              <Title viewUrl={viewLink} className={bemBlocks.item('title')} titleString={titleString}/>
              <StructuredDataImageObject schema={schema}/>
            </div>
          </ResultContext.Provider>)
      } else {
        return null
      }
    } else {
      return null
    }
  }

  render() {
    return (this.buildGridItem())
  }
}

export default StandardGridItem
