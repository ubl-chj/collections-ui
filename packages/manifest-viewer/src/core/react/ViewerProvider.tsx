import * as PropTypes from "prop-types"
import * as React from "react"
import {ViewerManager} from "../ViewerManager"
import {ViewerContext} from './ViewerContext'

export interface IViewerProps {
  viewer: ViewerManager
  children?: any
}

export class ViewerProvider extends React.Component<IViewerProps, any> {

  static childContextTypes = {
    viewer: PropTypes.instanceOf(ViewerManager),
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    viewer: PropTypes.instanceOf(ViewerManager).isRequired,
  }

  componentDidMount() {
    this.props.viewer.setupListeners()
    this.props.viewer.completeRegistration()
  }

  componentWillUnmount() {
    const {viewer} = this.props
    viewer.guidGenerator.reset()
  }

  getChildContext() {
    return {viewer: this.props.viewer}
  }

  render() {
    return (
      <ViewerContext.Provider value={this.props.viewer}>
        {this.props.children}
      </ViewerContext.Provider>)
  }
}
