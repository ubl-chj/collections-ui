import {ResultContext} from 'collections-ui-common'
import {buildImagePreview, buildImageView, buildThumbnailReference, getSchema, resolveManifestId,
  resolveName, shortenTitle} from 'collections-ui-common'
import * as React from 'react'
import {GridItemDisplay} from '../ui/GridItemDisplay'
import {ItemProps} from './ItemProps'

const extend = require('lodash/extend')

export class StandardGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {viewerUrl, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const manifestId = resolveManifestId(source)
    const thumbnail = buildThumbnailReference(source.thumbnail)
    if (thumbnail) {
      const schema = getSchema(source, manifestId, thumbnail, null)
     // const imageLink = buildImagePreview(previewUrl, source.thumbnail, manifestId)
      const viewUrl = buildImageView(viewerUrl, manifestId)
      const name = resolveName(schema)
      const titleString = shortenTitle(name)
      return (
        <ResultContext.Provider value={result}>
          <GridItemDisplay
            contentUrl={viewUrl}
            imageLink={viewUrl}
            schema={schema}
            thumbnail={thumbnail}
            titleString={titleString}
            {...this.props}
          />
        </ResultContext.Provider>)
    } else {
      return (null)
    }
  }
}

export default StandardGridItem
