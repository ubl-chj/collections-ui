import {UUIDResolver} from "manifest-uuid";
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {
  ActionBar,
  Controls,
  DocumentViewSwitcher,
  Layout,
  LayoutBody,
  ManifestItem,
  TopBar,
  ViewerManager,
  ViewerProvider,
} from 'ubl-viewer'
import {AuthUserProfile, AuthUserTooltip, BackArrow, BMenu, Logo} from '../components/ui'
import {Domain, Routes} from '../constants'
import {firebase} from '../firebase'
import '../styles/index.css'
import {SearchkitProvider} from 'searchkit-fork';

const ReactTooltip = require('react-tooltip')
const uuidv4 = require('uuid/v4')

class ViewerComponent extends React.Component<any, any> {
  viewer: ViewerManager
  manifest: string
  props: any

  constructor(props) {
    super(props)
    this.props = props
  }

  componentDidMount() {
    const uuid = this.props.match.params.uuid
    if (firebase) {
      const resolver = new UUIDResolver(uuid, firebase.uuidDb)
      resolver.resolveManifest().then((manifest) => {
        this.viewer = new ViewerManager(manifest)
        this.forceUpdate()
      })
    }
  }

  render() {
    const t = Boolean(true)
    if (this.viewer) {
      return (
        <ViewerProvider viewer={this.viewer}>
          <Layout>
            <TopBar>
              <div className='my-logo'>
                <Link className='my-logo' to={Routes.LANDING}>
                  <Logo className='JUQOtf'/>
                  <span className='JUQOtq'>{Domain.LOGO_TEXT}</span>
                </Link>
              </div>
              <div className='header__mid'/>
              <div className='profile' data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
                <AuthUserProfile/>
              </div>
              <ReactTooltip
                id='authUserProfile'
                offset={{left: 170}}
                globalEventOff='click'
                border={t}
                place='bottom'
                type='light'
                effect='solid'
              >
                <AuthUserTooltip/>
              </ReactTooltip>
            </TopBar>
            <ActionBar>
              <Controls {...this.props} uuid={uuidv4()}/>
            </ActionBar>
            <LayoutBody>
              <BackArrow/>
              <DocumentViewSwitcher viewerComponents={[{key: 'grid', title: 'Grid', itemComponent: ManifestItem, defaultOption: true}]}/>
            </LayoutBody>
          </Layout>
        </ViewerProvider>)
    } else {
      return null
    }
  }
}

export const Viewer = withRouter(ViewerComponent)
