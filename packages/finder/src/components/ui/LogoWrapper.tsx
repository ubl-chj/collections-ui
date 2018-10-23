import * as React from "react";
import {Link} from 'react-router-dom'
import {Domain, Routes} from "../../constants"
import {Logo} from "./svg"

export const LogoWrapper = () => {
  return (
    <div className='my-logo'>
      <Link className='my-logo' to={Routes.LANDING}>
        <Logo className='JUQOtf'/>
        <span className='JUQOtq'>{Domain.LOGO_TEXT}</span>
      </Link>
    </div>
  )
}
