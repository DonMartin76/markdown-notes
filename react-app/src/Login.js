import React from 'react';
import { Button, Col, Jumbotron, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  redirectToAuthServer
} from './actions';

const LoginView = ({
  authServers,
  onLogin
}) => {
  return (
    <div>
      <Jumbotron>
        <h1>Markdown Notes</h1>

        <p>This is a sample application to show the use of the OAuth 2.0 Implicit Flow with the wicked.haufe.io API Gateway</p>
      </Jumbotron>

      <Col md={3}>{' '}</Col>
      <Col md={6}>
        <Panel header="Log in" bsStyle="primary">

          <h4>If you want to use this application, please log in using one of the following identity providers:</h4>
          <br />

          {authServers.map(as =>
            <p>
              <Button onClick={() => onLogin(as.url, as.profileUrl)} bsSize="large" bsStyle={as.bsStyle} block={true}>{as.name}</Button>
            </p>
          )}
        </Panel>

      </Col>
      <Col md={2}>{' '}</Col>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authServers: state.authServers
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (url, profileUrl) => dispatch(redirectToAuthServer(url, profileUrl))
  }
};

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginView);
