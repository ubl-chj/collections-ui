import measureText from 'measure-text'
import React from 'react'
import {withRouter} from 'react-router'
import Select from 'react-select'

export class PageSelectorComponent extends React.Component<any, any> {
  static selectorStyles() {
    return {
      dropdownIndicator: (base) => ({
        ...base,
        display: 'none',
      }),
      indicatorSeparator: (base) => ({
        ...base,
        display: 'none',
      }),
      menu: (base) => ({
        ...base,
        width: '200px;',
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? 'black' : state.isFocused ? 'silver' : 'white',
        borderBottom: '1px dotted silver',
        color: state.isSelected ? 'white' : 'black',
      }),
    }
  }

  static calcMaxTextWidth(currentPageLabel) {
    const fontFamily = 'Roboto'
    const fontSize = '14px'
    const lineHeight = '14'
    return measureText({
      fontFamily,
      fontSize,
      lineHeight,
      text: currentPageLabel,
    }).width.value;
  }

 state: any

  constructor(props) {
    super(props)
    this.state = {
      currentPage: props.currentCanvas,
      currentPageLabel: null,
      imageCount: props.imageCount,
      maxTextWidth: null,
      options: {},
      selectedOption: {},
    }
  }

  selectorOptions() {
    const pages = this.state.imageCount
    const labels = this.props.canvasLabels
    const options = []
    if (labels.length) {
      labels.forEach((l, i) => {
        const option = {
          label: l, value: i,
        }
        options.push(option)
      })
    } else {
      for (let i = 0; i < pages; i++) {
        const option = {
          label: i, value: i,
        }
        options.push(option)
      }
    }
    return options
  }

  handlePaging = (selectedOption) => {
    this.setState({ selectedOption })
    this.setState({currentPage: selectedOption.value})
    this.setState({currentPageLabel: selectedOption.label})
    if (this.props.osd) {
      if (typeof selectedOption.value !== 'undefined') {
        this.props.osd.goToPage(selectedOption.value)
      } else {
        this.props.osd.goToPage(this.state.currentPage)
      }
    }
  }

  componentDidMount() {
    this.props.osd.addHandler('page', (data) => {
      this.setState({currentPage: data.page})
      this.setState({currentPageLabel: this.props.canvasLabels[data.page]})
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
        this.props.osd.addHandler('page', (data) => {
          if (this.state.currentPage !== data.page) {
            this.setState({currentPage: data.page})
            this.setState({currentPageLabel: this.props.canvasLabels[data.page]})
          }
      })
    }
  }

  render() {
    const options = this.selectorOptions()
    const {osd} = this.props
    const currentPage = this.state.currentPage
    const currentPageLabel = this.state.currentPageLabel
    let selectedPage
    let maxTextWidth = this.state.maxTextWidth
    if (osd) {
        if (currentPage) {
          selectedPage = {label: currentPageLabel, value: currentPage}
          maxTextWidth = PageSelectorComponent.calcMaxTextWidth(currentPageLabel)
        } else {
          selectedPage = {label: this.props.canvasLabels[0], value: 0}
          maxTextWidth = PageSelectorComponent.calcMaxTextWidth(this.props.canvasLabels[0])
        }
    }
    // TODO get the selector padding and minWidth values programmatically
    const minWidth = 72 + 8 + maxTextWidth + 0 + 'px'
    if (this.state.imageCount > 1) {
      return (
          <div className='selector' style={{paddingLeft: '10px', zIndex: 100, minWidth}}>
            <Select
              aria-label='select page'
              autosize={Boolean(true)}
              value={selectedPage}
              isSearchable={Boolean(true)}
              onChange={this.handlePaging}
              options={options}
              styles={PageSelectorComponent.selectorStyles()}
            />
        </div>)
    } else {
      return null
    }
  }
}

export const PageSelector = withRouter(PageSelectorComponent)
