import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {ActionBar, Layout, LayoutBody, Metadata, OsdComponent, TopBar, ViewerManager, ViewerProvider} from 'ubl-viewer'
import '../../assets/index.css'
import {Domain, Routes} from '../../constants'
import {AuthUserProfile, AuthUserTooltip, BackArrow} from '../ui'
import {StructuredDataImageObject} from '../schema/StructuredDataImageObject';

const ReactTooltip = require('react-tooltip')
const qs = require('query-string')

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

  constructor(props) {
    super(props)
    this.props = props
  }

  componentDidMount() {
    const params = qs.parse(this.props.location.search)
    const image = params.image
    const manifest = params.manifest
    this.image = image
    if (params.region) {
      if (!params.region.startsWith('pct:')) {
        this.region = params.region.split(',')
      } else {
        this.abstractRegion = params.region.substring(4).split(',')
      }
    }
    this.source = this.props.location.state.result._source
    this.document = image + '/info.json'
    this.viewer = new ViewerManager(manifest)
    this.forceUpdate()
  }

  render() {
    const t = Boolean(true)
    if (this.viewer) {
      return (
        <ViewerProvider viewer={this.viewer}>
          <Layout>
            <TopBar>
              <div className='my-logo-thin'>
                <Link className='my-logo' to={Routes.LANDING}>{Domain.LOGO_TEXT}</Link>
              </div>
              <div className='profile' data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
                <AuthUserProfile/>
              </div>
              <ReactTooltip id='authUserProfile' offset={{left: 170}} globalEventOff='click' border={t} place='bottom' type='light'
                effect='solid'>
                <AuthUserTooltip/>
              </ReactTooltip>
            </TopBar>
            <ActionBar>
              <Metadata key='metadata'/>
            </ActionBar>
            <LayoutBody>
              <BackArrow/>
              <OsdComponent images={[this.document]}/>
            </LayoutBody>
          </Layout>
        </ViewerProvider>)
    } else {
      return null
    }
  }
}

export const Previewer = withRouter(PreviewerComponent)
