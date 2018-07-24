import * as React from "react";
const extend = require("lodash/extend")

export const GridItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const osdComponentUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const viewerUrl = process.env.REACT_APP_UBL_IMAGE_VIEWER_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = source.iiifService + "/full/pct:25/0/default.jpg"
  const url = osdUrl + "?image=" + source.iiifService
  const pathname = new URL(source.iiifService).pathname
  const splitPath = pathname.split("/")
  const viewId = splitPath[5]
  const viewer = viewerUrl + viewId
  let titleString;
  if (source.metadata.Title.length >= 80) {
    titleString = source.metadata.Title.substr(0, 80) + "... "
  } else {
    titleString = source.metadata.Title
  }
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <a href={url} target="_blank"><img className={bemBlocks.item("poster")} alt="presentation" data-qa="poster"
          src={thumbnail} width="140"/></a>
      </div>
      <a href={viewer} target="_blank">
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html: titleString}}/>
      </a>
    </div>
  )
}
