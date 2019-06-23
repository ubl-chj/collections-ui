import React from 'react'
const tagManager = require('react-gtm-module')

export class StructuredDataImageObject extends React.Component<any, any> {

  schema: any

  constructor(props) {
    super(props)
    this.schema = props.schema
  }

  buildStructuredData() {
    const dataLayer = {
      dataLayer: this.schema,
      dataLayerName: 'schemaDataLayer',
    }
    tagManager.dataLayer(dataLayer)
  }

  componentDidMount() {
    this.buildStructuredData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.schema !== prevProps.schema) {
      this.buildStructuredData()
    }
  }

  render() {
    return (null)
  }
}
