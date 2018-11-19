import axios from 'axios'
import {AuthTokenContext} from 'collections-ui-common'
import {Domain} from 'collections-ui-common'
import Checkbox from 'rc-checkbox'
import * as React from 'react'
import {push as Menu} from 'react-burger-menu'
import {CircleLoader} from 'react-spinners'
import {EyeIcon} from '../svg'
import menuStylesDark from './styles/menuStylesDark'

const uuidv4 = require('uuid/v4')
const uuidv5 = require('uuidv5')

export enum VisionFeatureTypes {
  IMAGE_PROPERTIES = 'IMAGE_PROPERTIES',
  LABEL_DETECTION = 'LABEL_DETECTION',
  TEXT_DETECTION = 'DOCUMENT_TEXT_DETECTION',
  WEB_DETECTION = 'WEB_DETECTION',
}

export class VisionMenu extends React.Component<any, any> {

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

  state: any
  labels: any

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
        imageURI = parts[0] + '/full/full/0/default.jpg'
      } else {
        imageURI = parts[0] + '/full/full/0/native.jpg'
      }
    }
    return imageURI
  }

  buildCloudVisionRequest() {
    const {VISION_API_KEY, REDIS_BASE, VISION_API_BASE} = this.props
    const imageURI = this.buildImageURI()
    if (imageURI) {
      const requestURI = VISION_API_BASE + VISION_API_KEY
      let axiosGetReq
      let redisGetReq
      if (this.state.detectLabels) {
        const uuid = uuidv5('url', imageURI + '#labels')
        const redisGETRequestURI = REDIS_BASE + 'GET/' + uuid
        redisGetReq = {
          method: 'get',
          url: redisGETRequestURI,
        }
        axiosGetReq = {
          data: VisionMenu.buildCloudVisionRequestBody(imageURI, VisionFeatureTypes.LABEL_DETECTION),
          method: 'post',
          url: requestURI,
        }
        this.makeRedisGetRequest(redisGetReq, axiosGetReq)
        this.setState({currentRedisObject: uuid})
      } else if (this.state.detectText) {
        const uuid = uuidv5('url', imageURI + '#text')
        const redisGETRequestURI = REDIS_BASE + 'GET/' + uuid
        redisGetReq = {
          method: 'get',
          url: redisGETRequestURI,
        }
        axiosGetReq = {
          data: VisionMenu.buildCloudVisionRequestBody(imageURI, VisionFeatureTypes.TEXT_DETECTION),
          method: 'post',
          url: requestURI,
        }
        this.makeRedisGetRequest(redisGetReq, axiosGetReq)
        this.setState({currentRedisObject: uuid})
      } else if (this.state.imageProperties) {
        const uuid = uuidv5('url', imageURI + '#imageProps')
        const redisGETRequestURI = REDIS_BASE + 'GET/' + uuid
        redisGetReq = {
          method: 'get',
          url: redisGETRequestURI,
        }
        axiosGetReq = {
          data: VisionMenu.buildCloudVisionRequestBody(imageURI, VisionFeatureTypes.IMAGE_PROPERTIES),
          method: 'post',
          url: requestURI,
        }
        this.makeRedisGetRequest(redisGetReq, axiosGetReq)
        this.setState({currentRedisObject: uuid})
      } else if (this.state.detectWeb) {
        const uuid = uuidv5('url', imageURI + '#web')
        const redisGETRequestURI = REDIS_BASE + 'GET/' + uuid
        redisGetReq = {
          method: 'get',
          url: redisGETRequestURI,
        }
        axiosGetReq = {
          data: VisionMenu.buildCloudVisionRequestBody(imageURI, VisionFeatureTypes.WEB_DETECTION),
          method: 'post',
          url: requestURI,
        }
        this.makeRedisGetRequest(redisGetReq, axiosGetReq)
        this.setState({currentRedisObject: uuid})
      }
    }
  }

  makeRedisGetRequest = (redisGetReq, axiosGetReq) => {
    axios(redisGetReq).then((res) => {
      if (!res.data.GET) {
        this.setState({redisObjIsSet: false})
        return this.makeAxiosRequest(axiosGetReq)
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

  makeAxiosRequest = (req) => {
    axios(req).then((res) => {
      console.log('Vision API request returned ' + res.status)
      this.setState({visionResponse: res.data.responses[0]})
    }).catch((err) => {
      console.error('ERROR:', err);
    })
  }

  componentDidMount() {
    const {osd} = this.props
    osd.addHandler("page", (data) => {
      if (this.props.currentCanvas !== data.page) {
        this.setState({currentResourceURI: this.state.images[data.page]})
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

  buildVisionPresentation() {
    if (this.state.visionResponse) {
      if (this.state.visionResponse.labelAnnotations) {
        return (
          <div style={{backgroundColor: '#FFF', display: 'block'}}>
            <h5 style={{padding: '15px'}}>Label Annotations</h5>
            <ul>
              {this.state.visionResponse.labelAnnotations.map((label) => <li key={uuidv4()}>{label.description}</li>)}
            </ul>
          </div>)
      } else if (this.state.visionResponse.textAnnotations) {
        return (
        <div style={{backgroundColor: '#FFF', display: 'block'}}>
          <h5 style={{padding: '15px'}}>Text Annotations</h5>
          <p style={{padding: '15px'}}>
            {this.state.visionResponse.textAnnotations[0].description}
          </p>
        </div>)
      } else if (this.state.visionResponse.webDetection) {
        if (this.state.visionResponse.webDetection.visuallySimilarImages) {
          return (
            <div style={{backgroundColor: '#FFF', display: 'block'}}>
              <h5 style={{padding: '15px'}}>Similar on Web</h5>
              <ul style={{listStyle: 'none'}}>
                {this.state.visionResponse.webDetection.visuallySimilarImages.map((page) =>
                  <li key={uuidv4()}><a href={page.url} target='_blank' rel='noopener noreferrer'><img width='170' src={page.url}/></a>
                  </li>)}
              </ul>
            </div>)
        }
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
