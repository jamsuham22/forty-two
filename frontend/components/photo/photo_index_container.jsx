import { connect } from 'react-redux';
import PhotoIndex from './photo_index';
import {
  fetchPhoto,
  fetchPhotos,
  receiveErrors,
  receiveNoErrors,
  deletePhoto
} from '../../actions/photo_actions';
import { logout } from '../../actions/session_actions';
import { openModal, openModalShow } from '../../actions/modal_actions';


const mapStateToProps = (state) => {
  return {
    currentUserId: state.session.currentUserId,
    errors: state.errors,
    photos: Object.values(state.entities.photos),
    users: state.entities.users
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchPhoto: (id) => dispatch(fetchPhoto(id)),
  fetchPhotos: () => dispatch(fetchPhotos()),
  logout: () => dispatch(logout()),
  deletePhoto: (id) => dispatch(deletePhoto(id)),
  openModal: modal => dispatch(openModal(modal)),
  openModalShow: photoId => dispatch(openModalShow(photoId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoIndex);
