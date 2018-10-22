import {UUIDResolver} from "manifest-uuid/";
import {ViewerManager} from 'manifest-viewer'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
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
  image: string
  document: string
  source: object
  state: {
    ActionBar: React.ComponentType<any>
    Controls: React.ComponentType<any>
    Layout: React.ComponentType<any>
    LayoutBody: React.ComponentType<any>
    OsdComponent: React.ComponentType<any>
    TopBar: React.ComponentType<any>
    ViewerManager: React.ComponentType<any>
    ViewerProvider: React.ComponentType<any>
    width: number,
  }

  constructor(props) {
    super(props)
    this.props = props
    this.state = {
      ActionBar: null,
      Controls: null,
      Layout: null,
      LayoutBody: null,
      OsdComponent: null,
      TopBar: null,
      ViewerManager: null,
      ViewerProvider: null,
      width: props.width,
    }
  }

  async componentWillMount() {
    const {ActionBar, Controls, Layout, LayoutBody, OsdComponent, TopBar, ViewerProvider} = await import(`manifest-viewer`)
    this.setState({ActionBar, Controls, Layout, LayoutBody, OsdComponent, TopBar, ViewerProvider})
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
    const {ActionBar, Controls, Layout, LayoutBody, OsdComponent, TopBar, ViewerProvider, width} = this.state
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
              <OsdComponent canvasLabels={null} images={[this.document]} width={width}/>
            </LayoutBody>
          </Layout>
        </ViewerProvider>)
    } else {
      return null
    }
  }
}

export const Previewer = withRouter(PreviewerComponent)
