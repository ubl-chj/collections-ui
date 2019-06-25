import React, {ReactElement} from 'react'

export const Footer: React.FC<any> = (props): ReactElement => {
  const {dataLayer} = props

  const buildDataLayerPresentation = () => {
    return dataLayer.slice(4)
  }

  return (
    <pre>
      {JSON.stringify(buildDataLayerPresentation(), null, 2)}
    </pre>
  )
}
