import * as React from 'react';
import {mapping} from 'schema-map'

export interface IMetadataSchemaAdapterProps {
  contentUrl: string
  position?: number
  source: any
  thumbnail: string
}

export class MetadataSchemaAdapter extends React.Component<IMetadataSchemaAdapterProps, any> {
  mainEntity: any
  source: any
  metadata = {}
  private readonly contentUrl: any;
  private readonly thumbnail: any;
  private readonly name?: string;

  constructor(source, contentUrl, thumbnail, name) {
    super(source)
    this.mainEntity = {} as any
    this.source = source
    this.contentUrl = contentUrl
    this.thumbnail = thumbnail
    this.name = name
    this.metadata = {} as any
  }

  buildMainEntity(source) {
    Object.defineProperty(this.mainEntity, '@type',
      {
        enumerable: true,
        value: 'CreativeWork',
      })

    const mappingProps = this.getMappingProps(source)
    mappingProps.forEach((k) => {
      const label = mapping[k]
      const val = this.metadata[k]
      Object.defineProperty(this.mainEntity, label,
        {
          configurable: true,
          enumerable: true,
          value: val,
        })
    })
  }

  getMappingProps(source) {
    const mappingProps = Object.getOwnPropertyNames(mapping)

    source.forEach((s) => {
      Object.defineProperty(this.metadata, s.resource.label,
        {
          configurable: true,
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
        '@context': 'http://schema.org',
        '@type': 'ImageObject',
        'contentUrl': this.contentUrl,
        'mainEntity': ordered,
        'name': this.name,
        'thumbnail': this.thumbnail,
      },
      dataLayerName: 'schemaDataLayer',
    }
  }
}
