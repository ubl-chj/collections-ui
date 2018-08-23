import * as React from "react";
import {Link} from 'react-router-dom'
import {Domain} from '../../constants';
import {ResultContext} from "../core";
import {Thumbnail} from "../ui";
import {ItemProps} from './ItemProps'
import {buildImagePreview} from './ItemUtils';

const extend = require('lodash/extend')

export const makeValue = (value) => {
    return {__html: value}
}

export const ListCollectionEntry = (props) => {
  const {label, value} = props
  const val = makeValue(value)
  return (
    <div className='schema-list'>
      <div className='schema-list__left'>
        <span className='schema-list-key'><b>{label}</b></span>
      </div>
      <div className='schema-list-value' dangerouslySetInnerHTML={val}/>
    </div>
  )
}

export class CollectionsListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {result, bemBlocks, previewUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const imageSource = source.imageServiceIRI + Domain.LANDING_THUMBNAIL_API_REQUEST
    const imageLink = buildImagePreview(previewUrl, source.imageServiceIRI)
    const updated = new Date(source.metadataMap.tag3).toDateString();
    const updatedKey = 'Last Updated'
    const totalDocsKey = 'Total Documents'
    return (
      <ResultContext.Provider value={result}>
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail
            imageWidth={100}
            imageSource={imageSource}
            imageLink={imageLink}
            className={bemBlocks.item('poster')}
          />
          <div className={bemBlocks.item('details')}>
            <div className='schema-list'>
              <div className='schema-list__left'>
                <span className='schema-list-key'><b>Collection:</b></span>
              </div>
              <div className='schema-list-value'><Link to={source.metadataMap.tag2}>{source.metadataMap.tag1}</Link>
              </div>
            </div>
            <ListCollectionEntry label={updatedKey} value={updated}/>
            <ListCollectionEntry label={totalDocsKey} value={source.metadataMap.tag4}/>
          </div>
        </div>
      </ResultContext.Provider>)
  }
}
