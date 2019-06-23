import {Domain} from 'collections-ui-common'
import React, {ReactElement} from 'react'
import {HeadProvider, Meta, Title} from 'react-head'

export const HeadMeta: React.FC<any> = (): ReactElement => {
  return (
    <HeadProvider>
      <Title>{Domain.LOGO_TEXT}</Title>
      <Meta property='og:site_name' content={Domain.LOGO_TEXT}/>
      <Meta property='og:type' content='website'/>
      <Meta property='og:url' content={window.location.href}/>
      <Meta property='og:title' content={Domain.LOGO_TEXT}/>
      <Meta property='og:image' content={Domain.LOGO_URL}/>
      <Meta name='theme-color' content='#FFF'/>
      <Meta name='description' content={Domain.META_DESCRIPTION}/>
    </HeadProvider>
  )
}
