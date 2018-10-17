import * as React from "react";
import {Link} from 'react-router-dom'
import {SearchBox, TopBar} from "searchkit-fork";
import {Domain, Routes} from "../../constants";
import {AuthProfile} from "./profiles";
import {CloseButton, Logo, SearchIcon} from "./svg";

export class Head extends React.Component<any, any> {
  routeConfig: string

  constructor(props) {
    super(props)
    this.routeConfig = props.routeConfig
    this.state = {
      searchBoxVisible: false,
      width: props.width,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
  }

  toggleSearchBox = () => {
    this.setState((prevState) => {
      return {searchBoxVisible: !prevState.searchBoxVisible};
    })
  }

  buildSearchBox() {
    const {routeConfig} = this.props
    const {width} = this.state
    const isMobile = width <= 500
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
    const {width} = this.state
    return(
      <TopBar>
        <div className='my-logo'>
          <Link className='my-logo' to={Routes.LANDING}>
            <Logo className='JUQOtf'/>
            <span className='JUQOtq'>{Domain.LOGO_TEXT}</span>
          </Link>
        </div>
        {this.buildSearchBox()}
        <AuthProfile width={width}/>
      </TopBar>
    )
  }
}
