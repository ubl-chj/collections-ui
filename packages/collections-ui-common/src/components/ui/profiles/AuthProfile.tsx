import {useMediaQuery} from '@material-ui/core'
import React, {ReactElement} from 'react'
import {AuthUserContext} from '../../auth/'
import {AuthUserProfile} from './AuthUserProfile'
import {AuthUserTooltip} from './AuthUserTooltip'
const ReactTooltip = require('react-tooltip')

export const AuthProfile: React.FC<any> = (): ReactElement => {
  const matches = useMediaQuery('(max-width:600px)')
   return !matches ? (
      <div>
        <div data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
          <AuthUserProfile/>
        </div>
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
          <ReactTooltip
            className='authUserTooltip'
            id='authUserProfile'
            offset={{left: 170}}
            globalEventOff='click'
            border={Boolean(true)}
            place='bottom'
            type='light'
            effect='solid'
            getContent={() => <AuthUserTooltip/>}
          /> : null
          }
        </AuthUserContext.Consumer>
        </div>) : null
}
