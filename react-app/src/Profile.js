import React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import {
  changeUsername,
  changeDisplayName,
  changeEmail,
  changeCompany
} from './actions';

export const isUsernameValid = (username) => {
  return (username && username.length > 0);
};

const ProfileView = ({
  profile,
  usernameValid,
  onChangeUsername,
  onChangeDisplayName,
  onChangeEmail,
  onChangeCompany,
}) => {
  return (
    <div>
      <FormGroup controlId="registerUsername" validationState={usernameValid}>
        <ControlLabel>Username (mandatory):</ControlLabel>
        <FormControl componentClass="input" placeholder="Enter username" value={profile.username} onChange={() => onChangeUsername(document.getElementById("registerUsername").value)} />
      </FormGroup>

      <FormGroup controlId="registerDisplayName">
        <ControlLabel>Your Name:</ControlLabel>
        <FormControl componentClass="input" placeholder="Enter display name" value={profile.name} onChange={() => onChangeDisplayName(document.getElementById("registerDisplayName").value)} />
      </FormGroup>

      <FormGroup controlId="registerEmail">
        <ControlLabel>Email:</ControlLabel>
        <FormControl componentClass="input" placeholder="Enter email address" value={profile.email} onChange={() => onChangeEmail(document.getElementById("registerEmail").value)} />
      </FormGroup>

      <FormGroup controlId="registerCompany">
        <ControlLabel>Company (optional):</ControlLabel>
        <FormControl componentClass="input" placeholder="Enter company" value={profile.company} onChange={() => onChangeCompany(document.getElementById("registerCompany").value)} />
      </FormGroup>
    </div>
  )
}

const mapStateToProps = (state) => {
  const usernameValid = isUsernameValid(state.user.username);
  return {
    profile: state.user,
    usernameValid: usernameValid ? "success" : "error",
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeUsername: (username) => dispatch(changeUsername(username)),
    onChangeEmail: (email) => dispatch(changeEmail(email)),
    onChangeDisplayName: (displayName) => dispatch(changeDisplayName(displayName)),
    onChangeCompany: (company) => dispatch(changeCompany(company))
  }
};


export const Profile = connect(mapStateToProps, mapDispatchToProps)(ProfileView);
