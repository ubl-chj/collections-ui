import * as React from "react";
import {Domain} from "../../constants";
import {ResultContext} from "../core";
import {ListItemDisplay} from "../ui/ListItemDisplay";
import {ItemProps} from './ItemProps'
import {buildImagePreview, buildImageView, buildUBLManifestId, getSchema} from './ItemUtils';

const extend = require("lodash/extend")

export class AtomicListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  dataLayer: any

  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    this.dataLayer = (window as any).schemaDataLayer ? (window as any).schemaDataLayer : null
  }

  render() {
    const {result, previewUrl, viewerUrl} = this.props
    if (result) {
      // const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
      const source = extend({}, result._source, result.highlight)
      const thumbnail = source.iiifService + Domain.THUMBNAIL_API_REQUEST
      const manifestId = buildUBLManifestId(source.iiifService)
      const imageLink = buildImagePreview(previewUrl, source.iiifService, manifestId)
      const viewUrl = buildImageView(viewerUrl, manifestId)
      const schema = getSchema(source, manifestId, thumbnail, source.imageIndex)
      // the generator is cool, but not particularly maintainable or flexible
      // const query = "{\"query\":{\"multi_match\":{\"query\":\"" + source.URN +
      //  "\",\"type\":\"cross_fields\",\"operator\":\"and\"}},\"size\":500}"
      // const manifestView = viewerUrl + "?manifest=" + encodeURIComponent(constManifestUrl + query)
      return (
        <ResultContext.Provider value={result}>
          <ListItemDisplay
            contentUrl={viewUrl}
            imageLink={imageLink}
            schema={schema}
            thumbnail={thumbnail}
            {...this.props}
          />
        </ResultContext.Provider>)
    } else {
      return null
    }
  }
}

export default AtomicListItem
