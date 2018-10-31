import {Domain} from 'collections-ui-common'
import * as React from 'react'
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
        <Meta property='og:site_name' content={Domain.LOGO_TEXT}/>
        <Meta property='og:type' content='website'/>
        <Meta property='og:url' content={href}/>
        <Meta property='og:title' content={title}/>
        <Meta property='og:image' content={thumbnail}/>
        <Meta name='theme-color' content='#FFF'/>
        <Meta name='description' content={description}/>
      </HeadProvider>)
  }
}
