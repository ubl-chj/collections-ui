import * as React from "react"
import {ArrowLeftIcon, ArrowRightIcon} from "../svg"

export class PagingControls extends React.Component<any, any> {

  state: any

  constructor(props) {
    super(props)
    this.state = {
      osd: props.osd,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.osd !== prevProps.osd) {
      this.setState({osd: this.props.osd})
    }
  }

  componentDidMount() {
    window.onkeydown = this.listenForKeydown.bind(this)
  }

  listenForKeydown(e) {
    e = e || window.event;

    if (e.key === 'ArrowRight') {
      this.goToNext();
    }
    if (e.key === 'ArrowLeft') {
      this.goToPrevious();
    }
  }

  goToNext() {
    if (this.state.osd) {
      this.state.osd.nextButton.onRelease()
    }
  }

  goToPrevious() {
    if (this.state.osd) {
      this.state.osd.previousButton.onRelease()
    }
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
