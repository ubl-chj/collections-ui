import * as React from 'react'
import {HomeIcon, RotateLeftIcon, RotateRightIcon, ZoomInIcon, ZoomOutIcon} from "../svg"

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
        <RotateLeftIcon/>
        <RotateRightIcon/>
      </div>
    )
  }
}
