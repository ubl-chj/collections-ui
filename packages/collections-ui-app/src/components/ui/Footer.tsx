import React from 'react'

export class Footer extends React.Component<any, any> {
  dataLayer: object[]

  constructor(props) {
    super(props)
    this.dataLayer = props.dataLayer
  }

  buildDataLayerPresentation() {
    return this.dataLayer.slice(4)
  }

  render() {
    return (
      <pre>
        {JSON.stringify(this.buildDataLayerPresentation(), null, 2)}
      </pre>
    )
  }
}
