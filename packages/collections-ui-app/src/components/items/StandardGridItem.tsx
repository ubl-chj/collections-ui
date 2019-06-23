import {
  buildImageView,
  buildThumbnailReference,
  getSchema,
  resolveManifestId,
  resolveName,
  ResultContext,
  shortenTitle
} from 'collections-ui-common'
import {GridItemDisplay} from '../ui/GridItemDisplay'
import {ItemProps} from './ItemProps'
import React, {ReactElement} from 'react'
import extend from 'lodash/extend'

export const StandardGridItem: React.FC<ItemProps> = (props): ReactElement => {
  const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const {result} = props
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
          {...props}
        />
      </ResultContext.Provider>)
  } else {
    return (null)
  }
}

export default StandardGridItem
