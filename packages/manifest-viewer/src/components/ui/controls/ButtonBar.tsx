import * as React from 'react'
import {ArrowLeftIcon, ArrowRightIcon, HomeIcon, RotateLeftIcon, RotateRightIcon, ZoomInIcon, ZoomOutIcon} from "../svg";

export class ButtonBar extends React.Component<any, any> {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={this.props.className}>
        <ZoomInIcon/>
        <ZoomOutIcon/>
        <HomeIcon/>
        <ArrowLeftIcon/>
        <ArrowRightIcon/>
        <RotateLeftIcon/>
        <RotateRightIcon/>
      </div>
    )
  }
}
