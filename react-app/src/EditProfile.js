import React from 'react';
import { Button, Col, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Profile, isUsernameValid } from './Profile';

import { saveUser } from './actions';

const ErrorMessageView = ({
  hasError
}) => {
  if (hasError) {
    return (
      <Panel header="Error" bsStyle="danger">
        <p>An error occurred while saving. We are horribly sorry. Try again, and if that doesn't help, please reload the application.</p>
      </Panel>
    );
  }
  return (
    <div />
  )
};

const mapStateToErrorMessageProps = (state) => {
  return {
    hasError: state.user.saveError
  };
};

const ErrorMessage = connect(mapStateToErrorMessageProps, null)(ErrorMessageView);

const EditProfileView = ({
  profile,
  preventSubmit,
  onSaveClick
}) => {
  return (
    <div>
      <Col md={3}>{' '}</Col>
      <Col md={6}>
        <Panel header="Edit Profile" bsStyle="primary">
          <h4>Edit your profile:</h4>

          <Profile />

          <ErrorMessage />

          <br />
          <Button disabled={preventSubmit} onClick={onSaveClick} bsStyle="success" block={true}>Save Profile</Button>
        </Panel>
      </Col>
    </div>
  )
};

const mapStateToProps = (state) => {
  const usernameValid = isUsernameValid(state.user.username);
  const preventSubmit = !usernameValid || state.user.saving;
  return {
    profile: state.user,
    preventSubmit,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSaveClick: () => dispatch(saveUser())
  };
};

export const EditProfile = connect(mapStateToProps, mapDispatchToProps)(EditProfileView);