import * as React from "react";
import {mapping} from './mapping'

export interface IMetadataSchemaAdapterProps {
  contentUrl: string
  position?: number
  source: any
  thumbnail: string
}

export class MetadataSchemaAdapter extends React.Component<IMetadataSchemaAdapterProps, any> {
  mainEntity: any
  mappingFileName: string
  source: any
  metadata = {}
  private readonly contentUrl: any;
  private readonly thumbnail: any;
  private readonly position?: any;

  constructor(source, contentUrl, thumbnail, position) {
    super(source)
    this.mappingFileName = './metadataMapping.json'
    this.mainEntity = {} as any
    this.source = source
    this.contentUrl = contentUrl
    this.thumbnail = thumbnail
    this.position = position
    this.metadata = {} as any
  }

  buildMainEntity(source) {
    Object.defineProperty(this.mainEntity, '@type',
      {
        enumerable: true,
        value: "CreativeWork",
      })

    const mappingProps = this.getMappingProps(mapping, source)
    mappingProps.forEach((k) => {
      const label = mapping[k]
      const val = this.metadata[k]
      Object.defineProperty(this.mainEntity, label,
        {
          enumerable: true,
          value: val,
        })
    })
  }

  getMappingProps(mapping, source) {
    const mappingProps = Object.getOwnPropertyNames(mapping)

    source.forEach((s) => {
      Object.defineProperty(this.metadata, s.resource.label,
        {
          enumerable: true,
          value: s.resource.value,
        })
    })
    const sourceKeys = Object.getOwnPropertyNames(this.metadata)
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
