import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { connect } from 'react-redux';
import { receivePhoto } from '../../actions/photo_actions';
import { Link } from 'react-router-dom';
import CommentsContainer from '../comments/comments_container.jsx';

export default class PhotoShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.photo.title,
      description: this.props.photo.description,
      artist_id: this.props.photo.artist_id,
      img_url: this.props.photo.img_url,
      edit: false
    };

    this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
    this.handleSubmitFail = this.handleSubmitFail.bind(this);
    this.update=this.update.bind(this);
    this.toggleEdit= this.toggleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount(){
    this.props.fetchComments(this.props.photo.id);
  }

  toggleEdit(){
    if (this.state.edit === false ) {
      this.setState({edit: true})
    } else {
      this.setState({edit: false})
    }
  }

  handleSubmitSuccess(e) {
    e.preventDefault();
    this.props.action(this.state);
    this.toggleEdit();
  }

  handleSubmitFail(e) {
    e.preventDefault();
    this.props.action(this.state);
  }

  handleDelete(e) {
    e.preventDefault();
    this.props.deletePhoto(this.props.photo.id);
    this.props.closeModal();
  }

  update(field) {
    return (e) => {
      this.setState({[field]: e.currentTarget.value});
    };
  }


  render() {
    let imgSrc = this.props.artist.profile_url;
    if (this.props.artist.profile_picture) {
      imgSrc = this.props.artist.profile_picture.photo_url;
    }
    let errors;
    if (this.props.errors) {
      errors = (
        <ul className='error-lists'>
          {this.props.errors.map( error => {
            return <li>{error}</li>;
          })}
        </ul>
      );
    }

    let icon;
    let action;
    let likers = this.props.photo.likers.length;

    if (!this.props.photo.likers.includes(this.props.currentUserId)) {
      icon = <img src={window.like} />
      action = id => this.props.likePhoto(id)
    } else {
      icon = <img src={window.unlike}/>
      action = id => this.props.unlikePhoto(id)
    }

    let handleSubmit;
    if (this.state.title.length === 0 || this.state.description.length === 0 ) {
      handleSubmit = this.handleSubmitFail;
    } else {
      handleSubmit = this.handleSubmitSuccess;
    }
    let editButton;
    if (this.props.currentUserId === this.props.photo.artist_id) {
      editButton =
        <li>
          <button
            onClick={this.toggleEdit}
            className='upload-form-button'>
            Edit
          </button>
        </li>
    }
    let deleteButton;
    if (this.props.currentUserId === this.props.photo.artist_id) {
      deleteButton =
        <button
          onClick={this.handleDelete}
          className='upload-form-button'
          style={{"backgroundColor": "#ef5656"}}>
          Delete
        </button>
    }

    let content;
    let followerText = this.props.artist.followers.length < 2 ? "Follower" : "Followers"
    if (this.state.edit === false) {
      content = (
      <div className='dropzone-form'>
          <div className='preview'>
            <img src={`${this.props.photo.img_url}`} />
          </div>
          <div className='upload-form'>
            <ul className='upload-form-list'>
              <li>
                <div className='show-artist'>
                  <Link onClick={this.props.closeModal} to={`/profile/${this.props.photo.artist_id}`}>
                    <div className="profile-index-container">
                      <img className='profile-index' src={imgSrc} />
                    </div>
                </Link>
                  <section>
                    <Link onClick={this.props.closeModal} style={{"paddingLeft": "10px"}} to={`/profile/${this.props.photo.artist_id}`}>{this.props.artist.name}</Link>
                    <p className='show-uploaded' style={{"paddingLeft":"10px"}}>
                      {this.props.artist.followers.length} {followerText}
                    </p>
                  </section>
                </div>
                <section className='like-button' onClick={() => action(this.props.photo.id)}>
                  {icon}

                  <div>
                    {likers}
                  </div>
                </section>
                <p className='show-title'>
                  {this.props.photo.title}
                </p>
                <p className='show-uploaded'>
                  Uploaded {this.props.photo.time_posted} ago
                </p>
                <p className='show-description'>
                  {this.props.photo.description}
                </p>
              </li>
              {editButton}

                <CommentsContainer />

            </ul>
          </div>
      </div>
      )
    } else {
      content = (
      <form className='dropzone-form'>
          <div className='preview'>
            <img src={this.state.img_url} />
          </div>
          <div className='upload-form'>
            <ul className='upload-form-list'>
              <li>
                <button
                  className='upload-form-button'
                  onClick={handleSubmit}>
                  Submit
                </button>
              </li>
              <li>
                <button
                  onClick={this.toggleEdit}
                  className='upload-form-button'
                  style={{"backgroundColor": "#ef5656"}}>
                  Cancel
                </button>
              </li>
              <li>
                <label><p>Title</p>
                  <input
                    type="text"
                    value={this.state.title}
                    onChange={this.update('title')} />
                </label>
              </li>
              <li>
                <label><p>Description</p>
                  <textarea
                    value={this.state.description}
                    onChange={this.update('description')} />
                </label>
              </li>

              <li>
                {deleteButton}
              </li>
              <li>
                {errors}
              </li>
            </ul>
          </div>
      </form>
      )
    }

    return (
        content
    );
  }
}
