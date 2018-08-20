import * as React from "react";
import {ResultContext} from "../core";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {Thumbnail, Title} from "../ui";
import {ItemProps} from './ItemProps'
import {buildImagePreview, buildImageView, getSchema, shortenTitle} from './ItemUtils';

const extend = require("lodash/extend")

export class GettyGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {result, bemBlocks, previewUrl, viewerUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.thumbnail
    const imageBase = thumbnail.split('/full')[0]
    const contentUrl = source.id
    const imageLink = buildImagePreview(previewUrl, imageBase, contentUrl)
    const viewUrl = buildImageView(viewerUrl, contentUrl)
    const schema = getSchema(result, contentUrl, thumbnail, null)
    const titleString = shortenTitle(source.title)
    return (
      <ResultContext.Provider value={result}>
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={titleString}/>
          <StructuredDataImageObject schema={schema}/>
        </div>
      </ResultContext.Provider>)
  }
}

export default GettyGridItem
