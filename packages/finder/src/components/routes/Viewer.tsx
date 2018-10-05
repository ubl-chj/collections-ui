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
import {Domain, Routes} from '../../constants'
import {firebase} from '../../firebase'
import '../../styles/index.css'
import {withDynamicLayout} from "../core";
import {AuthProfile, BackArrow, Logo} from '../ui'

const uuidv4 = require('uuid/v4')

class ViewerComponent extends React.Component<any, any> {
  viewer: ViewerManager
  manifest: string
  props: any

  constructor(props) {
    super(props)
    this.props = props
    this.state = {
      width: props.width,
    }
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

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
  }

  render() {
    const {width} = this.state
    if (this.viewer) {
      return (
        <ViewerProvider viewer={this.viewer}>
          <Layout>
            <TopBar>
              <div className='my-logo'>
                <Link title={Domain.LOGO_TEXT} className='my-logo' to={Routes.LANDING}>
                  <Logo className='JUQOtf'/>
                  <span className='JUQOtq'>{Domain.LOGO_TEXT}</span>
                </Link>
              </div>
              <div className='header__mid'/>
              <AuthProfile width={width}/>
            </TopBar>
            <ActionBar>
              <Controls {...this.props} uuid={uuidv4()}/>
            </ActionBar>
            <LayoutBody>
              <BackArrow/>
              <DocumentViewSwitcher
                viewerComponents={[{defaultOption: true, itemComponent: withDynamicLayout(ManifestItem), key: 'grid', title: 'Grid',
                  }]}
              />
            </LayoutBody>
          </Layout>
        </ViewerProvider>)
    } else {
      return null
    }
  }
}

export const Viewer = withRouter(ViewerComponent)
