import {AuthProfile, LogoWrapper} from 'collections-ui-common'
import {CloseButton, SearchIcon} from './svg'
import {SearchBox, TopBar} from 'searchkit'
import React, {ReactElement, useState} from 'react'
import {useMediaQuery} from '@material-ui/core'

export const Head: React.FC<any> = (props): ReactElement => {
  const {routeConfig} = props
  const [searchBoxVisible, setIsSearchBoxVisible] = useState(false)
  const matches = useMediaQuery('(max-width:600px)')

  const toggleSearchBox = () => {
    setIsSearchBoxVisible(!searchBoxVisible)
  }

  const buildSearchBox = () => {
    if (matches) {
      if (searchBoxVisible) {
        return (
          <TopBar>
            <SearchBox
              autofocus={true}
              searchOnChange={true}
              queryFields={routeConfig.queryFields}
            />
            <div className='JUQOtc'>
              <button
                aria-label='toggle search box'
                className='sbico-d'
                type='button'
                onClick={toggleSearchBox}>
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
          <button
            aria-label='toggle search box'
            className='sbico-c'
            type='button'
            onClick={toggleSearchBox}>
              <span className='z1asCe'>
                <SearchIcon/>
              </span>
          </button>
        </div>
      )
    } else {
      return (
        <SearchBox
          autofocus={true}
          searchOnChange={true}
          queryFields={routeConfig.queryFields}
        />)
    }
  }
    return(
      <TopBar>
        <LogoWrapper/>
        {buildSearchBox()}
        <AuthProfile isMobile={matches}/>
      </TopBar>
    )
}
