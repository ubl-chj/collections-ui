import * as React from "react";
import TagManager from 'react-gtm-module'

export interface IStructuredDataItemList {
  hasPart: object[]
}

export class StructuredDataCollection extends React.Component<IStructuredDataItemList, any> {

  constructor(props) {
    super(props)
  }

  buildStructuredData() {
    const {hasPart} = this.props
    const schema = {
      dataLayer: {
        "@context": "http://schema.org",
        "@type": "Collection",
        "hasPart": hasPart,
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
