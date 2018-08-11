import * as React from "react";
import {Thumbnail, Title} from "../ui";
const extend = require("lodash/extend")

export class SctGridItem extends React.Component<any, any, any> {
  props: any
  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const previewUrl = process.env.REACT_APP_OSD_BASE
    const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const imageSource = result._source['thumbnail'] + '/full/90,/0/default.jpg'
    const imageLink = previewUrl + '?image=' + result._source['thumbnail']
    const viewUrl = viewerUrl + '?manifest=' + result._source['manifest']
    let titleString
    if (source.Title.length >= 80) {
      titleString = source.Title.substr(0, 80) + '... '
    } else {
      titleString = source.Title
    }
    return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink}
        className={bemBlocks.item('poster')}/>
      <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={titleString}/>
    </div>)
  }
}

export default SctGridItem
