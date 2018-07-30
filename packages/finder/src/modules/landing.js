import React, {Component} from 'react'
import extend from 'lodash/extend'
import {
  ActionBar,
  ActionBarRow,
  GroupedSelectedFilters,
  HitsStats,
  Layout,
  LayoutBody,
  LayoutResults,
  NoHits,
  Pagination,
  RefinementListFilter,
  ResetFilters,
  SearchBox,
  SearchkitManager,
  SearchkitProvider,
  SideBar,
  SortingSelector,
  TopBar,
  ViewSwitcherHits,
  ViewSwitcherToggle
} from 'searchkit'
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'
import '../index.css'
import {AuthUserContext} from '../components/core'
import firebase from 'firebase/app'

const host = process.env.REACT_APP_ELASTICSEARCH_HOST + 'a1'

const searchkit = new SearchkitManager(host)
const queryFields = ['imageServiceIRI', 'metadataMap.tag1', 'metadataMap.tag2', 'metadataMap.tag3', 'metadataMap.tag4',
  'metadataMap.tag5', 'metadataMap.tag6', 'metadataMap.tag7', 'metadataMap.tag8']

const CollectionsListItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = source.imageServiceIRI + '/full/90,/0/default.jpg'
  const url = osdUrl + '?image=' + source.imageServiceIRI

  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa="hit">
    <div className={bemBlocks.item('poster')}>
      <a href={url} target="_blank" rel="noopener noreferrer"><img className="thumbnail" alt="presentation"
        data-qa="poster" src={thumbnail}/></a>
    </div>
    <div className={bemBlocks.item('details')}>
      <table>
        <tbody>
        <tr>
          <td>Collection:</td>
          <td><a href={source.metadataMap.tag2} target="_blank" rel="noopener noreferrer">{source.metadataMap.tag1}</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>)
}

class Landing extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.setState({
      modal: !this.state.modal
    })
  }

  render () {
    return (<SearchkitProvider searchkit={searchkit}>
      <Layout>
        <TopBar>
          <div className="my-logo"><a className="my-logo" href="/" target="_blank" rel="noopener noreferrer">UBL</a></div>
          <SearchBox autofocus={true} searchOnChange={true} queryFields={queryFields}/>
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Profile</ModalHeader>
            <ModalBody>
              <AuthUserContext.Consumer>
                {(authUser) => authUser ? <div>
                  <img className="account-image-profile" src={firebase.auth().currentUser.photoURL}
                    alt="Account's profile image" aria-hidden="true"/>
                  <div className="gb_yb">
                    <div className="gb_Bb">{firebase.auth().currentUser.displayName}</div>
                    <div className="gb_Db">{firebase.auth().currentUser.email}</div>
                    <a className="btn btn-outline-secondary" href="/account">Account</a>
                  </div>
                </div> : null}
              </AuthUserContext.Consumer>
            </ModalBody>
            <ModalFooter>
              <a role="button" className="btn btn-outline-secondary" onClick={() => firebase.auth().signOut()}>Sign-out</a>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
          <AuthUserContext.Consumer>
            {(authUser) => authUser ?
              <div><a role="dialog" onClick={this.toggle}><img className="account-image" src={firebase.auth().currentUser.photoURL}
                alt="Account's profile image" aria-hidden="true"/></a>
              </div> : <div><a className="btn btn-outline-secondary" href="/login">Login</a></div>}
          </AuthUserContext.Consumer>
        </TopBar>
        <LayoutBody>
          <SideBar>
            <RefinementListFilter id="tag1" title="Collection" field="metadataMap.tag1.keyword" orderKey="_term"
              operator="AND"/>
          </SideBar>
          <LayoutResults>
            <ActionBar>
              <ActionBarRow>
                <HitsStats translations={{
                  'hitstats.results_found': '{hitCount} results found'
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[{label: 'Index', field: 'imageIndex', order: 'asc'},]}/>
              </ActionBarRow>
              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>
            </ActionBar>
            <ViewSwitcherHits hitsPerPage={50} highlightFields={['metadataMap.tag1']}
              hitComponents={[{key: 'list', title: 'List', itemComponent: CollectionsListItem}]} scrollTo="body"/>
            <NoHits suggestionsField={'metadataMap.tag1'}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>
        </LayoutBody>
      </Layout>
    </SearchkitProvider>)
  }
}

export default Landing
