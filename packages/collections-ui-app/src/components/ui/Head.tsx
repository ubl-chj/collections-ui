import {AuthProfile, LogoWrapper} from 'collections-ui-common'
import {CloseButton, SearchIcon} from './svg'
import {SearchBox, TopBar} from 'searchkit'
import React from 'react'

export class Head extends React.Component<any, any> {
  routeConfig: string

  constructor(props) {
    super(props)
    this.routeConfig = props.routeConfig
    this.state = {
      isMobile: props.isMobile,
      searchBoxVisible: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isMobile !== prevProps.isMobile) {
      this.setState({isMobile: this.props.isMobile})
    }
  }

  toggleSearchBox = () => {
    this.setState((prevState) => {
      return {searchBoxVisible: !prevState.searchBoxVisible};
    })
  }

  buildSearchBox() {
    const {routeConfig} = this.props
    const {isMobile} = this.state
    if (isMobile) {
      if (this.state.searchBoxVisible) {
        return (
          <TopBar>
            <SearchBox autofocus={true} searchOnChange={true} queryFields={routeConfig.queryFields}/>
            <div className='JUQOtc'>
              <button aria-label='toggle search box' className='sbico-d' type='button' onClick={this.toggleSearchBox}>
                <span className='z1asCe'>
                  <CloseButton/>
                </span>
              </button>
            </div>
          </TopBar>
        )
      }
      return (
        <div className='JUQOtc'>
          <button aria-label='toggle search box' className='sbico-c' type='button' onClick={this.toggleSearchBox}>
              <span className='z1asCe'>
                <SearchIcon/>
              </span>
          </button>
        </div>
      )
    } else {
      return (
        <SearchBox autofocus={true} searchOnChange={true} queryFields={routeConfig.queryFields}/>)
    }
  }

  render() {
    const {isMobile} = this.state
    return(
      <TopBar>
        <LogoWrapper/>
        {this.buildSearchBox()}
        <AuthProfile isMobile={isMobile}/>
      </TopBar>
    )
  }
}
