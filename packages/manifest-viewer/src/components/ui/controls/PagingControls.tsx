import * as React from "react"
import {ArrowLeftIcon, ArrowRightIcon} from "../svg"

export class PagingControls extends React.Component<any, any> {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <ArrowLeftIcon/>
        <ArrowRightIcon/>
      </div>
    )
  }
}
