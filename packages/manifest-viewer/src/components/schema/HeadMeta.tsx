import {Domain} from 'collections-ui-common'
import React from 'react'
import {HeadProvider, Meta, Title} from 'react-head'
import {buildDescription} from './SchemaUtils'

export class HeadMeta extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    const {title, href, thumbnail, schema} = this.props
    const description = buildDescription(schema)
    return (
      <HeadProvider>
        <Title>{title}</Title>
        <Meta content={Domain.LOGO_TEXT} property='og:site_name'/>
        <Meta content='website' property='og:type'/>
        <Meta content={href} property='og:url'/>
        <Meta content={title} property='og:title'/>
        <Meta content={thumbnail} property='og:image'/>
        <Meta content='#FFF' name='theme-color'/>
        <Meta content={description} name='description'/>
      </HeadProvider>)
  }
}
