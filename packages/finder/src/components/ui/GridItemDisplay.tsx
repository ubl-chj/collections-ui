import * as React from "react";
import {resolveCreator} from "../items";
import {Thumbnail, Title} from "./index";

export interface IGridItemDisplayProps {
  bemBlocks: any
  contentUrl: any
  imageLink: string
  thumbnail: string
  titleString: string
  schema: any
}

export class GridItemDisplay extends React.Component<IGridItemDisplayProps, any> {

  render() {
    const {bemBlocks, contentUrl, imageLink, thumbnail, titleString, schema} = this.props
    return (
      <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
        <Thumbnail
          imageWidth={190}
          imageSource={thumbnail}
          imageLink={imageLink}
          className={bemBlocks.item('poster')}
        />
        <Title
          viewUrl={contentUrl}
          className={bemBlocks.item('title')}
          titleString={titleString}
        />
        <div className={bemBlocks.item('author')} dangerouslySetInnerHTML={resolveCreator(schema)}/>
      </div>
    )
  }
}
