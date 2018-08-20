import * as React from "react";

export interface IStructuredDataImageObjectProps {
  contentUrl: string
  position?: number
  result: any
  thumbnail: string
}

export class SchemaAdapter extends React.Component<IStructuredDataImageObjectProps, any> {
  mainEntity: any
  mappingFileName: string
  result: any
  private readonly contentUrl: any;
  private readonly thumbnail: any;
  private readonly position?: any;

  constructor(result, contentUrl, thumbnail, position) {
    super(result)
    this.mappingFileName = './mapping.json'
    this.mainEntity = {} as any
    this.result = result
    this.contentUrl = contentUrl
    this.thumbnail = thumbnail
    this.position = position
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
    this.buildMainEntity(this.result)
    const ordered = {} as any
    Object.keys(this.mainEntity).sort().forEach((key) => {
      ordered[key] = this.mainEntity[key];
    });
    return {
      dataLayer: {
        "@context": "http://schema.org",
        "@type": "ImageObject",
        "contentUrl": this.contentUrl,
        "mainEntity": ordered,
        "position": this.position,
        "thumbnail": this.thumbnail,
      },
      dataLayerName: 'schemaDataLayer',
    }
  }
}
