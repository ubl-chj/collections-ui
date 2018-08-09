import * as React from "react";
import { Link } from 'react-router-dom'
import {Thumbnail} from "../ui";
const extend = require('lodash/extend')

export const CollectionsListItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const imageSource = source.imageServiceIRI + '/full/248,300/0/default.jpg'
  const imageLink = osdUrl + '?image=' + source.imageServiceIRI
  const updated = new Date(source.metadataMap.tag3).toDateString();
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <Thumbnail imageWidth={100} imageSource={imageSource} imageLink={imageLink} className={bemBlocks.item('poster')}/>
    <div className={bemBlocks.item('details')}>
      <table>
        <tbody>
        <tr>
          <td>Collection:</td>
          <td>
            <Link to={source.metadataMap.tag2}>{source.metadataMap.tag1}</Link>
          </td>
        </tr>
        <tr>
          <td>Last Updated:</td>
          <td>{updated}</td>
        </tr>
        <tr>
          <td>Total Documents:</td>
          <td>{source.metadataMap.tag4}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>)
}
