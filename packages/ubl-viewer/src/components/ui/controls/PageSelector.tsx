import * as React from "react";
import Select from 'react-select'
import {ViewerComponent} from "../../../core/react";

export class PageSelector extends ViewerComponent<any, any> {
  static selectorStyles() {
    return {
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? 'black' : 'white',
        borderBottom: '1px dotted silver',
        color: state.isSelected ? 'white' : 'black',
      }),
    }
  }

  state: any

  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0,
      imageCount: props.imageCount,
      osd: props.osd,
      selectedOption: null,
    }
  }

  selectorOptions() {
    const pages = this.state.imageCount
    const options = []
    for (let i = 0; i < pages; i++) {
      const option = {
        label: i, value: i,
      }
      options.push(option)
    }
    return options
  }

  handlePaging = (selectedOption) => {
    this.setState({ selectedOption })
    this.setState({currentPage: selectedOption.value})
    if (this.state.osd) {
      if (typeof selectedOption.value !== 'undefined') {
        this.state.osd.goToPage(selectedOption.value)
      } else {
        this.state.osd.goToPage(this.state.currentPage)
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.osd !== prevProps.osd) {
      this.setState({osd: this.props.osd})
    }
    if (this.props.imageCount !== prevProps.imageCount) {
      this.setState({imageCount: this.props.imageCount})
    }
  }

  render() {
    const options = this.selectorOptions()
    let currentPage
    if (this.state.osd) {
      this.state.osd.addHandler("page", (data) => {
        if (this.state.currentPage !== data.page) {
          this.setState({currentPage: data.page})
        }
      })
      if (this.state.currentPage) {
        currentPage = {label: this.state.currentPage, value: this.state.currentPage}
      } else {
        currentPage = {label: 0, value: 0}
      }
    }

    if (this.state.imageCount > 1) {
      return (
        <div className='selector'>
          <Select
            value={currentPage}
            isSearchable={Boolean(true)}
            onChange={this.handlePaging}
            options={options}
            styles={PageSelector.selectorStyles()}
          />
        </div>)
    } else {
      return null
    }
  }
}
