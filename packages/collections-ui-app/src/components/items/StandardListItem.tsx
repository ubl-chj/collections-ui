import {
  buildImageView,
  buildThumbnailReference,
  getSchema,
  resolveManifestId,
  ResultContext
} from 'collections-ui-common'
import {ListItemDisplay} from '../ui/ListItemDisplay'
import {ItemProps} from './ItemProps'
import React, {ReactElement} from 'react'
import extend from 'lodash/extend'

export const StandardListItem: React.FC<ItemProps> = (props): ReactElement => {
  const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const {result} = props
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
          {...props}
        />
      </ResultContext.Provider>)
  } else {
    return (null)
  }
}

export default StandardListItem
