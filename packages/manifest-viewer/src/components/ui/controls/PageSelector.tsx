import * as React from "react"
import {withRouter} from "react-router"
import Select from 'react-select'

export class PageSelectorComponent extends React.Component<any, any> {
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
      currentPage: props.currentCanvas,
      imageCount: props.imageCount,
      selectedOption: props.currentCanvas,
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
    if (this.props.osd) {
      if (typeof selectedOption.value !== 'undefined') {
        this.props.osd.goToPage(selectedOption.value)
      } else {
        this.props.osd.goToPage(this.state.currentPage)
      }
    }
  }

  componentDidMount() {
    this.props.osd.addHandler("page", (data) => {
      this.setState({currentPage: data.page})
    })
    if (this.state.currentPage) {
      this.props.osd.goToPage(this.state.currentPage)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.imageCount !== prevProps.imageCount) {
      this.setState({imageCount: this.props.imageCount})
    }
    if (prevState.currentPage !== this.state.currentPage) {
        this.props.history.replace(window.parent.location.pathname + '#' + this.state.currentPage)
        this.props.osd.addHandler("page", (data) => {
          if (this.state.currentPage !== data.page) {
            this.setState({currentPage: data.page})
          }
      })
    }
  }

  render() {
    const options = this.selectorOptions()
    const {osd} = this.props
    const currentPage = this.state.currentPage
    let selectedPage
    if (osd) {
        if (currentPage) {
          selectedPage = {label: currentPage, value: currentPage}
        } else {
          selectedPage = {label: 0, value: 0}
        }
    }

    if (this.state.imageCount > 1) {
      return (
        <div>
          <div className='selector'>
            <Select
              aria-label='select page'
              value={selectedPage}
              isSearchable={Boolean(true)}
              onChange={this.handlePaging}
              options={options}
              styles={PageSelectorComponent.selectorStyles()}
            />
          </div>
        </div>)
    } else {
      return null
    }
  }
}

export const PageSelector = withRouter(PageSelectorComponent)
