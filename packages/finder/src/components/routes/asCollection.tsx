import * as React from 'react'
import {withRouter} from 'react-router-dom';

export const asCollection = (Component) => {

  class Collection extends React.Component<any> {
    config: Object

    constructor(props) {
      super(props)
      this.config = {
        id: null
      }
    }

    render() {
      const id = this.props.match.params.id
      const configFileName = './config/' + id + '.json'
      const configFile = require(`${configFileName}`)
      const items = [configFile.gridItem, configFile.listItem]
      const config = {
        routeConfig: configFile
      };
      return (<Component {...this.props} config={config} items={items}/>)
    }
  }

  return withRouter(Collection);
}

