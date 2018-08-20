import * as React from "react";
import TagManager from 'react-gtm-module'

export class StructuredDataImageObject extends React.Component<any, any> {

  schema: any

  constructor(props) {
    super(props)
    this.schema = props.schema
  }

  buildStructuredData() {
    const dataLayer = {
      dataLayer: this.schema,
    }
    TagManager.dataLayer(dataLayer)
  }

  componentDidMount() {
    this.buildStructuredData()
  }

  render() {
    return (null)
  }
}
