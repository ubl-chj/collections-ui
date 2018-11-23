import axios from 'axios'
import {AuthTokenContext, Domain} from 'collections-ui-common'
import Checkbox from 'rc-checkbox'
import * as React from 'react'
import {push as Menu} from 'react-burger-menu'
import {CircleLoader} from 'react-spinners'
import {ViewerComponent} from "../../../core/react"
import {EyeIcon} from '../svg'
import menuStylesDark from './styles/menuStylesDark'

const uuidv4 = require('uuid/v4')
const uuidv5 = require('uuidv5')
const openSeaDragon = require('openseadragon')
const ReactTooltip = require('react-tooltip')

export enum VisionFeatureTypes {
  IMAGE_PROPERTIES = 'IMAGE_PROPERTIES',
  LABEL_DETECTION = 'LABEL_DETECTION',
  TEXT_DETECTION = 'DOCUMENT_TEXT_DETECTION',
  WEB_DETECTION = 'WEB_DETECTION',
}

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
      return (<img width='170' src={page.fullMatchingImages[0].url}/>)
    } else if (page.partialMatchingImages) {
      return (<img width='170' src={page.partialMatchingImages[0].url}/>)
    }
  }

  static buildWebDetectHeader(type) {
    if (type === 'matching') {
      return (<h6 style={{padding: '15px'}}>Matching on Web</h6>)
    } else if (type === 'similar') {
      return (<h6 style={{padding: '15px'}}>Similar on Web</h6>)
    }
  }

  state: any

  constructor(props) {
    super(props)
    this.state = {
      currentCanvas: props.currentCanvas,
      currentRedisObject: null,
      currentResourceURI: props.currentResourceURI,
      detectLabels: false,
      detectText: false,
      detectWeb: false,
      imageProperties: false,
      images: props.images,
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
    const {currentResourceURI} = this.state
    let imageURI
    if (currentResourceURI) {
      const parts = currentResourceURI.split('/info.json')
      // workaround 1.1
      if (!currentResourceURI.includes(Domain.LEGACY_API_COLLECTIONS)) {
        imageURI = parts[0] + Domain.FULL_IMAGE_API_REQUEST
      } else {
        imageURI = parts[0] + '/full/full/0/native.jpg'
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
        const visionApiReq = this.buildVisionApiRequest(imageURI, VisionFeatureTypes.LABEL_DETECTION)
        this.makeRedisGetRequest(redisGetReq, visionApiReq)
        this.setState({currentRedisObject: uuid})
      } else if (this.state.detectText) {
        const uuid = uuidv5('url', imageURI + '#text')
        const redisGetReq = this.buildRedisGetRequest(uuid)
        const visionApiReq = this.buildVisionApiRequest(imageURI, VisionFeatureTypes.TEXT_DETECTION)
        this.makeRedisGetRequest(redisGetReq, visionApiReq)
        this.setState({currentRedisObject: uuid})
      } else if (this.state.imageProperties) {
        const uuid = uuidv5('url', imageURI + '#imageProps')
        const redisGetReq = this.buildRedisGetRequest(uuid)
        const visionApiReq = this.buildVisionApiRequest(imageURI, VisionFeatureTypes.IMAGE_PROPERTIES)
        this.makeRedisGetRequest(redisGetReq, visionApiReq)
        this.setState({currentRedisObject: uuid})
      } else if (this.state.detectWeb) {
        const uuid = uuidv5('url', imageURI + '#web')
        const redisGetReq = this.buildRedisGetRequest(uuid)
        const visionApiReq = this.buildVisionApiRequest(imageURI, VisionFeatureTypes.WEB_DETECTION)
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

  setImageDimensions(currentCanvas) {
    const document = this.getDocument()
    if (document) {
      const sequences = document.getSequences()
      const firstSeq = sequences[0]
      const canvas = firstSeq.getCanvasByIndex(currentCanvas)
      const width = canvas.getWidth()
      const height = canvas.getHeight()
      this.setState({width})
      this.setState({height})
    }
  }

  componentDidMount() {
    this.setImageDimensions(this.state.currentCanvas)
    const {osd} = this.props
    osd.addHandler("page", (data) => {
      if (this.props.currentCanvas !== data.page) {
        this.setState({currentResourceURI: this.state.images[data.page]})
        this.setImageDimensions(data.page)
        osd.clearOverlays()
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const pp = prevProps
    if (this.state.detectLabels !== prevState.detectLabels) {
      if (this.state.detectLabels) {
        this.buildCloudVisionRequest()
      }
      this.setState({visionResponse: null})
    }
    if (this.state.detectText !== prevState.detectText) {
      if (this.state.detectText) {
        this.buildCloudVisionRequest()
      }
      this.setState({visionResponse: null})
    }
    if (this.state.imageProperties !== prevState.imageProperties) {
      if (this.state.imageProperties) {
        this.buildCloudVisionRequest()
      }
      this.setState({visionResponse: null})
    }
    if (this.state.detectWeb !== prevState.detectWeb) {
      if (this.state.detectWeb) {
        this.buildCloudVisionRequest()
      }
      this.setState({visionResponse: null})
    }
    if (this.state.currentResourceURI !== prevState.currentResourceURI) {
      if (this.state.detectText || this.state.detectLabels || this.state.detectWeb || this.state.imageProperties) {
        this.setState({visionResponse: null})
        this.buildCloudVisionRequest()
      }
    }

    if (this.state.visionResponse !== prevState.visionResponse) {
      if (!this.state.redisObjIsSet) {
        const redisSetURI = this.props.REDIS_BASE + 'SET/' + this.state.currentRedisObject
        const redisSetReq = {
          data: this.state.visionResponse,
          method: 'put',
          url: redisSetURI,
        }
        this.makeRedisSetRequest(redisSetReq)
      }
    }
  }

  addOverlay(xywh, eltId) {
    const {osd} = this.props
    const {width, height} = this.state
    const aspectRatio = height / width
    const elt = document.createElement('div')
    const dataTip = document.createAttribute('data-tip')
    const dataTarget = document.createAttribute('data-for')
    dataTarget.value = eltId
    elt.setAttributeNode(dataTip)
    elt.setAttributeNode(dataTarget)
    elt.id = eltId
    elt.className = 'highlight'
    if (osd && xywh && width) {
      const x = xywh.x / width
      const y = xywh.y / height * aspectRatio
      const w = xywh.w / width
      const h = xywh.h / height * aspectRatio
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
        return (textAnnos.slice(1).map((anno) => {
          const desc = anno.description
          const vertices = anno.boundingPoly.vertices
          const xywh = {
            h: vertices[2].y - vertices[0].y,
            w: vertices[1].x - vertices[0].x,
            x: vertices[0].x,
            y: vertices[0].y,
          }
          const eltId = uuidv4()
          this.addOverlay(xywh, eltId)
          return (
            <ReactTooltip
              className='extraClass'
              key={eltId}
              id={eltId}
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

  buildVisionPresentation() {
    if (this.state.visionResponse) {
      if (this.state.visionResponse.labelAnnotations) {
        return (
          <div style={{backgroundColor: '#FFF', display: 'block'}}>
            <h6 style={{padding: '15px'}}>Label Annotations</h6>
            <ul>
              {this.state.visionResponse.labelAnnotations.map((label) => <li key={uuidv4()}>{label.description}</li>)}
            </ul>
          </div>)
      } else if (this.state.visionResponse.textAnnotations) {
        return (
        <div style={{backgroundColor: '#FFF', display: 'block'}}>
          <h6 style={{padding: '15px'}}>Text Annotations</h6>
          <p style={{padding: '15px'}}>
            {this.state.visionResponse.textAnnotations[0].description}
          </p>
        </div>)
      } else if (this.state.visionResponse.webDetection) {
          return (
            <div style={{backgroundColor: '#FFF', display: 'block'}}>
              {this.state.visionResponse.webDetection.visuallySimilarImages ?
                VisionMenu.buildWebDetectHeader('similar') : null}
              <ul style={{listStyle: 'none'}}>
                {this.state.visionResponse.webDetection.visuallySimilarImages ?
                  this.state.visionResponse.webDetection.visuallySimilarImages.map((page) =>
                    <li key={uuidv4()}><a href={page.url} target='_blank' rel='noopener noreferrer'>
                      <img width='170' src={page.url}/></a>
                    </li>) : null}
              </ul>
              {this.state.visionResponse.webDetection.pagesWithMatchingImages ?
                VisionMenu.buildWebDetectHeader('matching') : null}
              <ul style={{listStyle: 'none'}}>
                {this.state.visionResponse.webDetection.pagesWithMatchingImages ?
                  this.state.visionResponse.webDetection.pagesWithMatchingImages.map((page) =>
                  <li key={uuidv4()}><a href={page.url} target='_blank' rel='noopener noreferrer'>
                    {VisionMenu.resolveImage(page)}</a>
                    <div dangerouslySetInnerHTML={{__html: page.pageTitle}}/>
                  </li>) : null}
              </ul>
            </div>)
      } else if (this.state.visionResponse.imagePropertiesAnnotation) {
        return (
          <div style={{backgroundColor: '#FFF', display: 'block'}}>
            <h5 style={{padding: '15px'}}>Image Properties</h5>
            <ul style={{listStyle: 'none'}}>
              {this.state.visionResponse.imagePropertiesAnnotation.dominantColors.colors.map((color) => {
                const red = color.color.red
                const blue = color.color.blue
                const green = color.color.green
                const backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')'
                return <li key={uuidv4()}><div style={{backgroundColor}}>{backgroundColor}</div></li>
              })}
            </ul>
          </div>)
      } else if (this.state.visionResponse.error) {
        return (
          <div style={{backgroundColor: '#FFF', display: 'block'}}>
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
