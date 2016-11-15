import React from 'react';
import { Button, Checkbox, Col, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Profile, isUsernameValid } from './Profile';

import {
  changeAcceptTerms,
  registerUser,
  logoutUser
} from './actions';

const RegisterView = ({
  profile,
  usernameValid,
  acceptTermsValid,
  preventSubmit,
  onChangeAcceptTerms,
  onRegisterClick,
  onCancelRegister,
}) => {
  return (
    <div>
      <Col md={3}>{' '}</Col>
      <Col md={6}>
        <Panel header="Register" bsStyle="primary">
          <h4>Please register your user with this application, and check the check box that you are aware of the terms and conditions:</h4>

          <Profile />

          {/* I have no clue what's wrong here, but the state never goes back again.*/}
          <Checkbox validationState={acceptTermsValid} onChange={(e) => onChangeAcceptTerms(e.target.value)}>I accept the Terms And Conditions of this app</Checkbox>

          <br />
          <Button disabled={preventSubmit} onClick={onRegisterClick} bsStyle="success" block={true}>Register</Button>
          <br />
          <Button onClick={onCancelRegister} bsStyle="danger" block={true}>Cancel</Button>
        </Panel>
      </Col>
    </div>
  )
}

const mapStateToProps = (state) => {
  const usernameValid = isUsernameValid(state.user.username);
  const acceptTermsValid = state.user.acceptTerms;
  const preventSubmit = !usernameValid || !acceptTermsValid;
  return {
    //profile: state.user,
    acceptTerms: state.user.acceptTerms,
    acceptTermsValid: acceptTermsValid ? "success" : "error",
    preventSubmit,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeAcceptTerms: (acceptTerms) => dispatch(changeAcceptTerms(acceptTerms)),
    onRegisterClick: () => dispatch(registerUser()),
    onCancelRegister: () => dispatch(logoutUser())
  }
};

export const Register = connect(mapStateToProps, mapDispatchToProps)(RegisterView);
