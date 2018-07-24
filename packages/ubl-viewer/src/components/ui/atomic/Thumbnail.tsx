import * as React from "react";
import {Component} from "react";
import axios from "axios";


export class Thumbnail extends Component {
  id: string
  state: { thumbnailUri: Array<string>; };
  thumbBase: string

  constructor(props) {
    super(props);
    this.id = props.id
    console.log(this.id)
    const pathname = new URL(this.id).pathname
    const splitPath = pathname.split("/")
    const namePart1 = splitPath[4]
    const namePart2 = splitPath[5]
    const combinedName = namePart1 + "-" + namePart2
    this.thumbBase = process.env.REACT_APP_EC_IMAGE_SERVICE_BASE + splitPath[4] + "/" + combinedName + "/" + combinedName
    this.state = {thumbnailUri: []}
  }

  render() {
    const osdUrl = process.env.REACT_APP_OSD_BASE
    const thumbSuffix = "/full/90,/0/default.jpg"
    const fullSizeSuffix = "/full/full/0/default.jpg"
    const thumbUrl = osdUrl + "?image=" + this.state.thumbnailUri
    return this.state.thumbnailUri.map((uri) => {
      return (<a href={uri + fullSizeSuffix} target="_blank"><img alt="e-codices" src={uri + thumbSuffix}/></a>)
    });
  }

  componentDidMount() {
    this.doPreflight(this.thumbBase)
  }

  doPreflight(id) {
    const info = "/info.json"
    const req = id + "_001r.jp2" + info
    let thumbs = []
    axios.head(req).then(() => {
      console.log(false)
      thumbs.push(id + "_001r.jp2")
      this.setState(() => {
        return {thumbnailUri: thumbs}
      })
    }).catch((error) => {
      if (error.response) {
        console.log(true)
        thumbs.push(id + "_001.jp2")
        this.setState(() => {
          return {thumbnailUri: thumbs}
        })
      }
    });
  }
}

