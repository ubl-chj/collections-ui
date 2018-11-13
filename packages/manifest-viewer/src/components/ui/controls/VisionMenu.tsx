import axios from 'axios'
import {Domain} from 'collections-ui-common'
import Checkbox from 'rc-checkbox'
import * as React from "react"
import {push as Menu} from 'react-burger-menu'
import {CircleLoader} from "react-spinners"
import {EyeIcon} from '../svg'
const uuidv4 = require('uuid/v4')

export enum VisionFeatureTypes {
  IMAGE_PROPERTIES = 'IMAGE_PROPERTIES',
  LABEL_DETECTION = 'LABEL_DETECTION',
  TEXT_DETECTION = 'DOCUMENT_TEXT_DETECTION',
  WEB_DETECTION = 'WEB_DETECTION',
}

export class VisionMenu extends React.Component<any, any> {

  static defaultProps = {
    apiKey: process.env.REACT_APP_VISION_API_KEY,
  }

  static menuStyles() {
    return {
      bmBurgerBars: {
        background: 'white',
        height: '10%',
      },
      bmBurgerButton: {
        height: '18px',
        left: '24px',
        position: 'fixed',
        top: '24px',
        width: '24px',
      },
      bmCross: {
        background: '#666',
      },
      bmCrossButton: {
        height: '24px',
        right: '20px',
        top: '59px',
        width: '24px',
      },
      bmItem: {
        display: 'inline-block',
      },
      bmItemList: {
        color: '#000',
        padding: '0.8em',
      },
      bmMenu: {
        backgroundColor: '#242424',
        bottom: '30px',
        boxSizing: 'border-box',
        height: '90%',
        opacity: '1',
        position: 'relative',
        top: '45px',
        transform: 'translateX(0)',
        width: '100%',
        wordWrap: 'break-word',
      },
      bmMorphShape: {
        fill: '#373a47',
      },
    }
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
      detectLabels: false,
      detectText: false,
      detectWeb: false,
      imageProperties: false,
      menuOpen: props.isOpen,
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
    const {currentResourceURI} = this.props
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
    const {apiKey} = this.props
    const imageURI = this.buildImageURI()
    if (imageURI) {
      const requestURI = 'https://vision.googleapis.com/v1/images:annotate?key=' + apiKey
      let req
      if (this.state.detectLabels) {
        req = {
          data: VisionMenu.buildCloudVisionRequestBody(imageURI, VisionFeatureTypes.LABEL_DETECTION),
          method: 'post',
          url: requestURI,
        }
        this.makeAxiosRequest(req)
      } else if (this.state.detectText) {
        req = {
          data: VisionMenu.buildCloudVisionRequestBody(imageURI, VisionFeatureTypes.TEXT_DETECTION),
          method: 'post',
          url: requestURI,
        }
        this.makeAxiosRequest(req)
      } else if (this.state.imageProperties) {
        req = {
          data: VisionMenu.buildCloudVisionRequestBody(imageURI, VisionFeatureTypes.IMAGE_PROPERTIES),
          method: 'post',
          url: requestURI,
        }
        this.makeAxiosRequest(req)
      } else if (this.state.detectWeb) {
        req = {
          data: VisionMenu.buildCloudVisionRequestBody(imageURI, VisionFeatureTypes.WEB_DETECTION),
          method: 'post',
          url: requestURI,
        }
        this.makeAxiosRequest(req)
      }
    }
  }

  makeAxiosRequest(req) {
    axios(req).then((res) => {
      this.setState({visionResponse: res.data.responses[0]})
      console.log(res)
    }).catch((err) => {
      console.error('ERROR:', err);
    })
  }

  componentDidUpdate(prevProps, prevState) {
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
    if (this.props.currentResourceURI !== prevProps.currentResourceURI) {
      if (this.state.detectText || this.state.detectLabels) {
        this.setState({visionResponse: null})
        this.buildCloudVisionRequest()
      }
    }

    if (this.state.visionResponse !== prevState.visionResponse) {
      this.forceUpdate()
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
      <div>
        <Menu
          disableCloseOnEsc={Boolean(true)}
          width='380px'
          styles={VisionMenu.menuStyles()}
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
          aria-label='toggle Cloud Vision'
          title='Cloud Vision'
          type="button"
          className="button-transparent"
          onClick={this.toggleVisionMenu}
        >
          <EyeIcon />
        </button>
      </div>
    )
  }
}
