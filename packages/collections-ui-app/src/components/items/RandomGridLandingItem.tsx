import {ResultContext} from 'collections-ui-common'
import {buildImagePreview, buildImageView, buildThumbnailReference, getSchema, resolveCreator,
  resolveManifestId, resolveName, Thumbnail, Title} from 'collections-ui-common'
import * as React from "react"
import {Link} from 'react-router-dom'
import {ItemProps} from './ItemProps'

const extend = require('lodash/extend')

export class RandomGridLandingItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  state: {
    result: any,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {result, bemBlocks, viewerUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const manifestId = resolveManifestId(source)
    const thumbnail = buildThumbnailReference(source.thumbnail)
    // const imageLink = buildImagePreview(previewUrl, source.thumbnail, manifestId)
    const viewUrl = buildImageView(viewerUrl, manifestId)
    const schema = getSchema(source, manifestId, thumbnail, null)
    const name = resolveName(schema)
    if (thumbnail) {
      return (
        <ResultContext.Provider value={result}>
          <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
              <Thumbnail
                imageWidth={170}
                imageSource={thumbnail}
                imageLink={viewUrl}
                className={'sk-hits-grid-hit__poster'}
              />
              <Title
                viewUrl={viewUrl}
                className={bemBlocks.item('title')}
                titleString={name}
              />
            <div className='sk-hits-grid-hit__author' dangerouslySetInnerHTML={resolveCreator(schema)}/>
          </div>
        </ResultContext.Provider>)
    } else {
      return null
    }
  }
}
