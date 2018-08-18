import * as React from "react";
import TagManager from 'react-gtm-module'

export class StructuredData extends React.Component<any, any, any> {

  props: any
  headline: string
  creator: string
  thumbnail: string
  contentUrl: string
  position: number

  constructor(props) {
    super(props)
    this.props = props
    this.headline = props.headline
    this.creator = props.creator
    this.thumbnail = props.thumbnail
    this.contentUrl = props.contentUrl
    this.position = props.position
  }

  buildStructuredData() {
    let positionKey
    let creatorKey
    if (this.position) {
      positionKey = "position"
    }
    if (this.creator) {
      creatorKey = "creator"
    }
    const schema = {
      dataLayer: {
        "@context": "http://schema.org",
        "@type": "ImageObject",
        "contentUrl": this.contentUrl,
        [creatorKey]: this.creator,
        "headline": this.headline,
        "thumbnail": this.thumbnail,
        [positionKey]: this.position,
      },
      dataLayerName: 'schemaDataLayer',
    }
    TagManager.dataLayer(schema)
  }

  componentDidMount() {
    this.buildStructuredData()
  }

  render() {
    return (null)
  }
}
