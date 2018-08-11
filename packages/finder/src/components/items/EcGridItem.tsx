import * as React from "react";
import {Thumbnail, Title} from "../ui";
const extend = require("lodash/extend")

export class ECGridItem extends React.Component<any, any, any> {
  props: any
  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const osdUrl = process.env.REACT_APP_OSD_BASE
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const imageSource = result._source['thumbnail'] + '/full/90,/0/default.jpg'
    const imageLink = osdUrl + '?image=' + result._source['thumbnail']
    const viewer = result._source['related']
    let titleString
    if (source.title.length >= 80) {
      titleString = source.title.substr(0, 80) + '... '
    } else {
      titleString = source.title
    }
    return (
      <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
        <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink}
          className={bemBlocks.item('poster')}/>
        <Title viewUrl={viewer} className={bemBlocks.item('title')} titleString={titleString}/>
      </div>)
  }
}

export default ECGridItem;
