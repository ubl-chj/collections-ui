import {UUIDResolver} from "manifest-uuid/";
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {ActionBar, Controls, Layout, LayoutBody, OsdComponent, TopBar, ViewerManager, ViewerProvider} from 'ubl-viewer'
import {Domain, Routes} from '../../constants'
import {firebase} from '../../firebase';
import '../../styles/index.css'
import {AuthProfile, Logo} from '../ui'

const qs = require('query-string')
const uuidv4 = require('uuid/v4')

class PreviewerComponent extends React.Component<any, any> {
  viewer: ViewerManager
  manifest: string
  props: any
  region: any
  abstractRegion: any
  coordinates: any
  image: string
  document: string
  source: object
  state: {
    width: number,
  }

  constructor(props) {
    super(props)
    this.props = props
    this.state = {
      width: props.width,
    }
  }

  componentDidMount() {
    const params = qs.parse(this.props.location.search)
    const image = params.image
    this.image = image
    if (params.region) {
      if (!params.region.startsWith('pct:')) {
        this.region = params.region.split(',')
      } else {
        this.abstractRegion = params.region.substring(4).split(',')
      }
    }
    const uuid = this.props.match.params.uuid
    if (firebase) {
      const resolver = new UUIDResolver(uuid, firebase.uuidDb)
      resolver.resolveManifest().then((manifest) => {
        this.viewer = new ViewerManager(manifest)
        this.forceUpdate()
      })
    }
    this.document = image + '/info.json'
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
                <Link className='my-logo' to={Routes.LANDING}>
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
              <OsdComponent images={[this.document]} width={width}/>
            </LayoutBody>
          </Layout>
        </ViewerProvider>)
    } else {
      return null
    }
  }
}

export const Previewer = withRouter(PreviewerComponent)
