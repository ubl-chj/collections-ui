import * as React from "react"
import {mapping} from 'schema-map'

export interface IStructuredDataImageObjectProps {
  contentUrl: string
  position?: number
  source: any
  thumbnail: string
}

export class SchemaAdapter extends React.Component<IStructuredDataImageObjectProps, any> {
  mainEntity: any
  mappingFileName: string
  source: any
  private readonly contentUrl: any;
  private readonly thumbnail: any;
  private readonly position?: any;

  constructor(source, contentUrl, thumbnail, position) {
    super(source)
    this.mainEntity = {} as any
    this.source = source
    this.contentUrl = contentUrl
    this.thumbnail = thumbnail
    this.position = position
  }

  buildMainEntity(source) {
    Object.defineProperty(this.mainEntity, '@type',
      {
        enumerable: true,
        value: "CreativeWork",
      })

    const mappingProps = this.getMappingProps(source)
    mappingProps.forEach((k) => {
      const label = mapping[k]
      const val = source[k]
      Object.defineProperty(this.mainEntity, label,
        {
          enumerable: true,
          value: val,
        })
    })
  }

  getMappingProps(source) {
    const mappingProps = Object.getOwnPropertyNames(mapping)
    const sourceKeys = Object.getOwnPropertyNames(source)
    return mappingProps.filter((x) => sourceKeys.includes(x));
  }

  buildStructuredData() {
    this.buildMainEntity(this.source)
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
        "thumbnail": this.thumbnail,
      },
      dataLayerName: 'schemaDataLayer',
    }
  }
}
