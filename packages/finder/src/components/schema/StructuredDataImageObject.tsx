import * as React from "react";
import TagManager from 'react-gtm-module'

export interface IStructuredDataImageObjectProps {
  contentUrl: string
  position?: number
  result: any
  thumbnail: string
}

export class StructuredDataImageObject extends React.Component<IStructuredDataImageObjectProps, any> {
  mainEntity: object
  mappingFileName: string

  constructor(props) {
    super(props)
    this.mappingFileName = './mapping.json'
    this.mainEntity = {}
  }

  buildMainEntity(result) {
    Object.defineProperty(this.mainEntity, '@type',
      {
        enumerable: true,
        value: "CreativeWork",
      })
    const mapping = require(`${this.mappingFileName}`)
    const mappingProps = this.getMappingProps(mapping, result._source)
    mappingProps.forEach((k) => {
      const label = mapping[k]
      const val = result._source[k]
      Object.defineProperty(this.mainEntity, label,
        {
          enumerable: true,
          value: val,
        })
    })
  }

  getMappingProps(mapping, source) {
    const mappingProps = Object.getOwnPropertyNames(mapping)
    const sourceKeys = Object.getOwnPropertyNames(source)
    return mappingProps.filter((x) => sourceKeys.includes(x));
  }

  buildStructuredData() {
    const {result, thumbnail, contentUrl, position} = this.props
    let positionKey
    if (position) {
      positionKey = "position"
    }

    this.buildMainEntity(result)
    const mainEntity = this.mainEntity
    const ordered = {};
    Object.keys(mainEntity).sort().forEach((key) => {
      ordered[key] = mainEntity[key];
    });
    const schema = {
      dataLayer: {
        "@context": "http://schema.org",
        "@type": "ImageObject",
        "contentUrl": contentUrl,
        "mainEntity": ordered,
        "thumbnail": thumbnail,
        [positionKey]: position,
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
