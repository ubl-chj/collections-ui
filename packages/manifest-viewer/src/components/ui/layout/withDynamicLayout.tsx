import * as React from 'react'

export const withDynamicLayout = (Component): any => {
  class DynamicLayout extends React.Component<any> {
    state = {
      width: null,
    }

    constructor(props) {
      super(props)
      this.state = {
        width: window.innerWidth,
      }
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleWindowSizeChange)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowSizeChange)
    }

    handleWindowSizeChange = () => {
      this.setState({ width: window.innerWidth })
    }

    render() {
      return (<Component {...this.props} width={this.state.width}/>)
    }
  }
  return DynamicLayout
}
