import * as React from "react";
import {ScrollIcon} from "../svg"

export class ViewSelector extends React.Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      images: props.images,
      osd: props.osd,
      scrollView: false,
    }
  }

  buildScrollView() {
    if (this.state.osd) {
      if (this.state.scrollView) {
        this.state.osd.world.removeItem(this.state.osd.world.getItemAt(0))
        this.state.images.forEach((i, index) => {
          this.state.osd.addTiledImage({
            tileSource: i,
            success(event) {
              const tiledImage = event.item
              tiledImage.setPosition({
                x: index * 1.05,
                y: 0,
              })
            },
          })
        })
      } else {
        this.state.osd.goToPage(0)
      }
    }
  }

  toggleScrollView = () => {
    this.setState((prevState) => {
      return {scrollView: !prevState.scrollView}
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.osd !== prevProps.osd) {
      this.setState({osd: this.props.osd})
    }
    if (this.props.images !== prevProps.images) {
      this.setState({images: this.props.images})
    }
  }

  render() {
    this.buildScrollView()
    return (
      <button
        aria-label='toggle scroll view'
        title='Scroll View'
        type="button"
        className="button-transparent"
        onClick={this.toggleScrollView}
      >
        <ScrollIcon/>
      </button>
    )
  }
}
