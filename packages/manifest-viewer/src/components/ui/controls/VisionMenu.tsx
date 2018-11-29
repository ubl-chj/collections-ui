import axios from 'axios'
import {AuthTokenContext, Domain} from 'collections-ui-common'
import Checkbox from 'rc-checkbox'
import * as React from 'react'
import {push as Menu} from 'react-burger-menu'
import ReactDOM from 'react-dom'
import {CircleLoader} from 'react-spinners'
import {ViewerComponent} from '../../../core/react'
import {VisionFeatureType} from '../../enums'
import {EyeIcon} from '../svg'
import menuStylesDark from './styles/menuStylesDark'

const uuidv4 = require('uuid/v4')
const uuidv5 = require('uuidv5')
const openSeaDragon = require('openseadragon')
const ReactTooltip = require('react-tooltip')

export class VisionMenu extends ViewerComponent<any, any> {

  static defaultProps = {
    REDIS_BASE: process.env.REACT_APP_REDIS_BASE,
    VISION_API_BASE: process.env.REACT_APP_VISION_API_BASE,
    VISION_API_KEY: process.env.REACT_APP_VISION_API_KEY,
  }

  static buildCloudVisionRequestBody(imageURI, visionFeatureType) {
    return {
      requests: [
        {
          features: [
            {
              type: visionFeatureType,
            },
          ],
          image: {
            source: {
              imageUri: imageURI,
            },
          },
        },
      ],
    }
  }

  static resolveImage(page) {
    if (page.fullMatchingImages) {
      return (<img alt='' width='170' src={page.fullMatchingImages[0].url}/>)
    } else if (page.partialMatchingImages) {
      return (<img alt='' width='170' src={page.partialMatchingImages[0].url}/>)
    }
  }

  static buildWebDetectHeader(type) {
    if (type === 'matching') {
      return (<h6 style={{padding: '15px'}}>Matching on Web</h6>)
    } else if (type === 'similar') {
      return (<h6 style={{padding: '15px'}}>Similar on Web</h6>)
    }
  }

  static getMaxSizeFromProfile(tiledImage, size) {
    let maxRequestSize
    const aspectRatio = size.x / size.y
    if (tiledImage.source.profile !== 'undefined' && Array.isArray(tiledImage.source.profile)) {
      if (tiledImage.source.profile[1].maxHeight && aspectRatio < 1) {
        maxRequestSize = {
          height: tiledImage.source.profile[1].maxHeight,
          width: '',
        }
      } else if (tiledImage.source.profile[1].maxWidth && aspectRatio > 1) {
        maxRequestSize = {
          height: '',
          width: tiledImage.source.profile[1].maxWidth,
        }
      }
    }
    return maxRequestSize
  }

  state: any

  constructor(props) {
    super(props)
    this.state = {
      currentCanvas: props.currentCanvas,
      currentRedisObject: null,
      currentResourceURI: props.currentResourceURI,
      dataPage: 0,
      detectLabels: false,
      detectText: false,
      detectWeb: false,
      imageProperties: false,
      images: props.images,
      isHighlighted: false,
      maxRequestSize: null,
      menuOpen: props.isOpen,
      osd: props.osd,
      redisObjIsSet: false,
      visionResponse: null,
    }
  }

  handleStateChange = (state) => {
    this.setState({menuOpen: state.menuOpen})
  }

  toggleVisionMenu = () => {
    this.setState((prevState) => {
      return {menuOpen: !prevState.menuOpen};
    })
    this.setState({
      detectLabels: false,
      detectText: false,
      detectWeb: false,
      imageProperties: false,
      isHighlighted: false,
    })
  }

  toggleImageProperties = () => {
    this.setState((state) => ({
      imageProperties: !state.imageProperties,
    }))
  }

  toggleLabelDetect = () => {
    this.setState((state) => ({
      detectLabels: !state.detectLabels,
    }))
  }

  toggleTextDetect = () => {
    this.setState((state) => ({
      detectText: !state.detectText,
    }))
  }

  toggleWebDetect = () => {
    this.setState((state) => ({
      detectWeb: !state.detectWeb,
    }))
  }

  buildFeatureTypes() {
    return (
      <div style={{width: 200}} className='xjKiLc'>
        <div className='Hj59Ib'>Detect Labels</div>
        <Checkbox
          aria-label='detect label'
          onChange={this.toggleLabelDetect}
        />
        <div className='Hj59Ib'>Detect Text</div>
        <Checkbox
          aria-label='detect text'
          onChange={this.toggleTextDetect}
        />
        <div className='Hj59Ib'>Image Properties</div>
        <Checkbox
          aria-label='image properties'
          onChange={this.toggleImageProperties}
        />
        <div className='Hj59Ib'>Detect Web</div>
        <Checkbox
          aria-label='web detect'
          onChange={this.toggleWebDetect}
        />
      </div>
    )
  }

  buildImageURI() {
    const {currentResourceURI, maxRequestSize} = this.state
    let imageURI
    if (currentResourceURI && maxRequestSize) {
      const parts = currentResourceURI.split('/info.json')
      // workaround 1.1
      if (!currentResourceURI.includes(Domain.LEGACY_API_COLLECTIONS)) {
        imageURI = parts[0] + '/full/' + maxRequestSize.width + ',' + maxRequestSize.height + '/0/default.jpg'
      } else {
        imageURI = parts[0] + '/full/' + maxRequestSize.width + ',' + maxRequestSize.height + '/0/native.jpg'
      }
    }
    return imageURI
  }

  buildRedisGetRequest(uuid) {
    const {REDIS_BASE} = this.props
    const redisGETRequestURI = REDIS_BASE + 'GET/' + uuid
    return {
      method: 'get',
      url: redisGETRequestURI,
    }
  }

  buildVisionApiRequest(imageURI, visionFeatureType) {
    const {VISION_API_KEY, VISION_API_BASE} = this.props
    const requestURI = VISION_API_BASE + VISION_API_KEY
    return {
      data: VisionMenu.buildCloudVisionRequestBody(imageURI, visionFeatureType),
      method: 'post',
      url: requestURI,
    }
  }

  buildCloudVisionRequest() {
    const imageURI = this.buildImageURI()
    if (imageURI) {
      if (this.state.detectLabels) {
        const uuid = uuidv5('url', imageURI + '#labels')
        const redisGetReq = this.buildRedisGetRequest(uuid)
        const visionApiReq = this.buildVisionApiRequest(imageURI, VisionFeatureType.LABEL_DETECTION)
        this.makeRedisGetRequest(redisGetReq, visionApiReq)
        this.setState({currentRedisObject: uuid})
      } else if (this.state.detectText) {
        const uuid = uuidv5('url', imageURI + '#text')
        const redisGetReq = this.buildRedisGetRequest(uuid)
        const visionApiReq = this.buildVisionApiRequest(imageURI, VisionFeatureType.TEXT_DETECTION)
        this.makeRedisGetRequest(redisGetReq, visionApiReq)
        this.setState({currentRedisObject: uuid})
      } else if (this.state.imageProperties) {
        const uuid = uuidv5('url', imageURI + '#imageProps')
        const redisGetReq = this.buildRedisGetRequest(uuid)
        const visionApiReq = this.buildVisionApiRequest(imageURI, VisionFeatureType.IMAGE_PROPERTIES)
        this.makeRedisGetRequest(redisGetReq, visionApiReq)
        this.setState({currentRedisObject: uuid})
      } else if (this.state.detectWeb) {
        const uuid = uuidv5('url', imageURI + '#web')
        const redisGetReq = this.buildRedisGetRequest(uuid)
        const visionApiReq = this.buildVisionApiRequest(imageURI, VisionFeatureType.WEB_DETECTION)
        this.makeRedisGetRequest(redisGetReq, visionApiReq)
        this.setState({currentRedisObject: uuid})
      }
    }
  }

  makeRedisGetRequest = (redisGetReq, visionApiReq) => {
    axios(redisGetReq).then((res) => {
      if (!res.data.GET) {
        this.setState({redisObjIsSet: false})
        return this.makeVisionApiRequest(visionApiReq)
      } else {
        console.log('Redis GET returned ' + res.status)
        const obj = JSON.parse(res.data.GET)
        this.setState({visionResponse: obj})
      }
    }).catch((err) => {
      console.error('ERROR:', err);
    })
  }

  makeRedisSetRequest = (redisSetReq) => {
    axios(redisSetReq).then((res) => {
      console.log('Redis SET returned ' + res.status)
      this.setState({redisObjIsSet: true})
    }).catch((err) => {
      console.error('ERROR:', err);
    })
  }

  makeVisionApiRequest = (req) => {
    axios(req).then((res) => {
      console.log('Vision API request returned ' + res.status)
      this.setState({visionResponse: res.data.responses[0]})
    }).catch((err) => {
      console.error('ERROR:', err);
    })
  }

  getMaxRequestSize(tiledImage, size) {
    // this is ugly :(
    let maxRequestSize
    maxRequestSize = VisionMenu.getMaxSizeFromProfile(tiledImage, size)
    if (!maxRequestSize) {
      if (typeof tiledImage.source.sizes !== 'undefined' && Array.isArray(tiledImage.source.sizes)) {
        const maxWidth = Math.max(...tiledImage.source.sizes.map((dims) => dims.width), 0)
        const sizes = tiledImage.source.sizes
        maxRequestSize = sizes.filter((dim) => {
          return dim.width === maxWidth
        })[0]
      } else {
        maxRequestSize = {
          height: size.y,
          width: size.x,
        }
      }
    }
    return maxRequestSize
  }

  componentDidMount() {
    const {osd} = this.props
    osd.addHandler('open', () => {
      const tiledImage = osd.world.getItemAt(0)
      if (tiledImage) {
        const size = tiledImage.getContentSize()
        const maxRequestSize = this.getMaxRequestSize(tiledImage, size)
        const width = size.x
        const height = size.y
        this.setState({width})
        this.setState({height})
        this.setState({maxRequestSize})
      }
    })
    osd.addHandler('page', (data) => {
      if (this.props.currentCanvas !== data.page) {
        this.setState({currentResourceURI: this.state.images[data.page]})
        this.setState({isHighlighted: false})
        osd.clearOverlays()
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const {currentRedisObject, currentResourceURI, detectLabels, detectText, detectWeb, highlightedId, imageProperties, redisObjIsSet,
      visionResponse} = this.state
    const pp = prevProps
    if (detectLabels !== prevState.detectLabels) {
      if (detectLabels) {
        this.buildCloudVisionRequest()
      }
      this.setState({visionResponse: null})
    }
    if (detectText !== prevState.detectText) {
      if (detectText) {
        this.buildCloudVisionRequest()
      }
      this.setState({visionResponse: null})
    }
    if (imageProperties !== prevState.imageProperties) {
      if (imageProperties) {
        this.buildCloudVisionRequest()
      }
      this.setState({visionResponse: null})
    }
    if (detectWeb !== prevState.detectWeb) {
      if (detectWeb) {
        this.buildCloudVisionRequest()
      }
      this.setState({visionResponse: null})
    }
    if (currentResourceURI !== prevState.currentResourceURI) {
      if (detectText || detectLabels || detectWeb || imageProperties) {
        this.setState({visionResponse: null})
        this.buildCloudVisionRequest()
      }
    }

    if (visionResponse !== prevState.visionResponse) {
      if (!redisObjIsSet) {
        const redisSetURI = this.props.REDIS_BASE + 'SET/' + currentRedisObject
        const redisSetReq = {
          data: visionResponse,
          method: 'put',
          url: redisSetURI,
        }
        this.makeRedisSetRequest(redisSetReq)
      }
    }

    if (highlightedId !== prevState.highlightedId) {
      this.setState({isHighlighted: true})
    }
  }

  addOverlay(xywh, eltId) {
    const {osd} = this.props
    const {width, height, maxRequestSize} = this.state
    const scaleRatio = width / maxRequestSize.width
    const aspectRatio = height / width
    const elt = document.createElement('div')
    const dataTip = document.createAttribute('data-tip')
    const dataTarget = document.createAttribute('data-for')
    dataTarget.value = 'tt_' + eltId
    elt.setAttributeNode(dataTip)
    elt.setAttributeNode(dataTarget)
    elt.id = eltId
    elt.className = 'highlight'
    if (osd && xywh && width) {
      const x = xywh.x / width * scaleRatio
      const y = xywh.y / height * aspectRatio * scaleRatio
      const w = xywh.w / width * scaleRatio
      const h = xywh.h / height * aspectRatio * scaleRatio
      osd.addOverlay({
        element: elt,
        location: new openSeaDragon.Rect(x, y, w, h),
      })
    }
  }

  buildTextAnnotationOverlays() {
    if (this.state.visionResponse) {
      const textAnnos = this.state.visionResponse.textAnnotations
      if (textAnnos) {
        return (textAnnos.slice(1).map((anno, index) => {
          const desc = anno.description
          const vertices = anno.boundingPoly.vertices
          const xywh = {
            h: vertices[2].y - vertices[0].y,
            w: vertices[1].x - vertices[0].x,
            x: vertices[0].x,
            y: vertices[0].y,
          }
          const eltId = 'overlay' + index.toString().padStart(5, '0')
          this.addOverlay(xywh, eltId)
          return (
            <ReactTooltip
              className='extraClass'
              key={uuidv4()}
              id={'tt_' + eltId}
              effect='solid'
              delayHide={500}
              delayShow={500}
              delayUpdate={500}
              place={'top'}
              border={true}
              type={'light'}
            >
              {desc}
            </ReactTooltip>)
        }))
      }
    }
  }

  addHighlightLabel = (id) => {
    if (this.state.isHighlighted) {
      const eltId = 'overlay' + id
      const overlay = document.getElementById(eltId)
      if (overlay) {
        return ReactDOM.createPortal(
          <div style={{backgroundColor: '#000', height: '100%', zIndex: 1000, width: '100%'}}>X</div>,
          overlay,
        )
      }
    }
  }

  toggleHighlighter = (id) => {
    this.setState({
      highlightedId: id,
      isHighlighted: true,
    })
  }

  buildTextAnnotations() {
    if (this.state.visionResponse) {
      const textAnnos = this.state.visionResponse.textAnnotations
      if (textAnnos) {
        return (textAnnos.slice(1).map((anno, index) => {
          const desc = anno.description
          const id = index.toString().padStart(5, '0')
          return (
            <span
              onClick={() => this.toggleHighlighter(id)}
              className='text'
              key={uuidv4()}
              dangerouslySetInnerHTML={{__html: '&nbsp;' + desc}}
              role='button'
            />)
        }))
      }
    }
  }

  buildVisionPresentation() {
    const {highlightedId, isHighlighted, visionResponse} = this.state
    if (visionResponse) {
      if (visionResponse.labelAnnotations) {
        return (
          <div className='annotationDisplay'>
            <h6 style={{padding: '15px'}}>Label Annotations</h6>
            <ul>
              {visionResponse.labelAnnotations.map((label) => <li key={uuidv4()}>{label.description}</li>)}
            </ul>
          </div>)
      } else if (visionResponse.textAnnotations) {
        return (
          <div className='annotationDisplay'>
            <h6 style={{padding: '15px'}}>Text Annotations</h6>
            <p style={{padding: '15px'}}>
              {this.buildTextAnnotations()}
              {isHighlighted && highlightedId ? this.addHighlightLabel(highlightedId) : null}
            </p>
          </div>)
      } else if (visionResponse.webDetection) {
        return (
          <div className='annotationDisplay'>
            {visionResponse.webDetection.visuallySimilarImages ?
              VisionMenu.buildWebDetectHeader('similar') : null}
            <ul style={{listStyle: 'none'}}>
              {visionResponse.webDetection.visuallySimilarImages ?
                visionResponse.webDetection.visuallySimilarImages.map((page) =>
                  <li key={uuidv4()}><a href={page.url} target='_blank' rel='noopener noreferrer'>
                    <img alt='' width='170' src={page.url}/></a>
                  </li>) : null}
            </ul>
            {visionResponse.webDetection.pagesWithMatchingImages ?
              VisionMenu.buildWebDetectHeader('matching') : null}
            <ul style={{listStyle: 'none'}}>
              {visionResponse.webDetection.pagesWithMatchingImages ?
                visionResponse.webDetection.pagesWithMatchingImages.map((page) =>
                  <li key={uuidv4()}><a href={page.url} target='_blank' rel='noopener noreferrer'>
                    {VisionMenu.resolveImage(page)}</a>
                    <div dangerouslySetInnerHTML={{__html: page.pageTitle}}/>
                  </li>) : null}
            </ul>
          </div>)
      } else if (visionResponse.imagePropertiesAnnotation) {
        return (
          <div className='annotationDisplay'>
            <h6 style={{padding: '15px'}}>Image Properties</h6>
            <ul style={{listStyle: 'none'}}>
              {visionResponse.imagePropertiesAnnotation.dominantColors.colors.map((color) => {
                const red = color.color.red
                const blue = color.color.blue
                const green = color.color.green
                const backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')'
                return <li key={uuidv4()}><div style={{backgroundColor}}>{backgroundColor}</div></li>
              })}
            </ul>
          </div>)
      } else if (visionResponse.error) {
        return (
          <div className='annotationDisplay'>
            <p style={{padding: '15px'}}>
              This Image cannot be accessed by Cloud Vision
            </p>
          </div>)
      }
    } else {
      return (
        <div className='centered'>
          <CircleLoader color='#FFF' loading={true}/>
        </div>
      )
    }
  }

  render() {
    return (
      <AuthTokenContext.Consumer>
        {(idTokenResult) => idTokenResult && idTokenResult.claims.admin ?
          <div>
            <Menu
              disableCloseOnEsc={Boolean(true)}
              width='380px'
              styles={menuStylesDark}
              noOverlay={true}
              right={false}
              customBurgerIcon={false}
              isOpen={this.state.menuOpen}
              onStateChange={this.handleStateChange}
            >
              {this.buildFeatureTypes()}
              {this.buildVisionPresentation()}
            </Menu>
            {this.buildTextAnnotationOverlays()}
            <button
              aria-label='Cloud Vision'
              title='Cloud Vision'
              type="button"
              className="button-transparent"
              onClick={this.toggleVisionMenu}
            >
              <EyeIcon />
            </button>
          </div> : null
        }
      </AuthTokenContext.Consumer>
    )
  }
}
