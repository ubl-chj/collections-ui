import * as React from "react";
import * as PropTypes from "prop-types";
import {ViewerManager} from "../ViewerManager"

export interface ViewerProps {
  viewer:ViewerManager
  children?:any
}

export class ViewerProvider extends React.Component<ViewerProps,any> {

  static childContextTypes = {
    viewer:PropTypes.instanceOf(ViewerManager)
  }

  static propTypes = {
    viewer:PropTypes.instanceOf(ViewerManager).isRequired,
    children:PropTypes.element.isRequired
  }

  componentWillMount() {
  }

  componentDidMount(){}

  componentWillUnmount(){
    const {viewer} = this.props
  }

  getChildContext(){
    return {viewer:this.props.viewer}
  }

  render(){
    return this.props.children
  }
}
