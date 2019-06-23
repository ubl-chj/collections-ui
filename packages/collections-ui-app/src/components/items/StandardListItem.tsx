import {
  buildImageView,
  buildThumbnailReference,
  getSchema,
  resolveManifestId,
  ResultContext
} from 'collections-ui-common'
import {ListItemDisplay} from '../ui/ListItemDisplay'
import {ItemProps} from './ItemProps'
import React from 'react'
import extend from 'lodash/extend'

export class StandardListItem extends React.Component<ItemProps, any> {

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
      return (
        <ResultContext.Provider value={result}>
          <ListItemDisplay
            contentUrl={viewUrl}
            imageLink={viewUrl}
            schema={schema}
            thumbnail={thumbnail}
            {...this.props}
          />
        </ResultContext.Provider>)
    } else {
      return (null)
    }
  }
}

export default StandardListItem
