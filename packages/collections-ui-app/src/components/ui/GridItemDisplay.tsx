import {resolveCreator, Thumbnail, Title} from 'collections-ui-common'
import React, {ReactElement} from 'react'

export interface IGridItemDisplayProps {
  bemBlocks: any
  contentUrl: any
  imageLink: string
  thumbnail: string
  titleString: string
  schema: any
}

export const GridItemDisplay: React.FC<IGridItemDisplayProps> = (props): ReactElement => {
  const {bemBlocks, contentUrl, imageLink, thumbnail, titleString, schema} = props
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa="hit">
      <Thumbnail
        imageWidth={170}
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
