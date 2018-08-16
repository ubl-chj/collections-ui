import * as React from "react";
import {ItemProps} from "./ItemProps";
const extend = require('lodash/extend')

export class ContentGridItem extends React.Component<ItemProps, any> {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
  }

  render() {
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.iiifService + '/full/pct:25/0/default.jpg'
    const url = source.iiifService + '/full/full/0/default.jpg'
    const pathname = new URL(source.iiifService).pathname
    const splitPath = pathname.split('/')
    const viewId = splitPath[5]
    const viewerUrl = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
    const titleString = source.metadata.Title.substr(0, 50) + '... : ' + source.imageIndex
    return (
      <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
        <div className={bemBlocks.item('poster')}>
          <a href={url} target='_blank' rel='noopener noreferrer'>
            <img className={bemBlocks.item('poster')} alt='presentation' data-qa='poster' src={thumbnail} width='140'/></a>
        </div>
        <a href={viewerUrl} target='_blank' rel='noopener noreferrer'>
          <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: titleString}}/>
        </a>
      </div>
    )
  }
}
