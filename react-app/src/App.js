import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { connect } from 'react-redux';

//import logo from './logo.svg';
import { Navigation } from './Navigation';
import { NotesIndex } from './NotesIndex';
import { Editor } from './Editor';
import { EditProfile } from './EditProfile';
import { Errors } from './Errors';
import { Register } from './Register';
import { Login } from './Login';
import './App.css';

const MainView = ({
  view
}) => {
  switch (view) {
    case "ERROR":
      return (
        <Errors />
      );
    case "PROFILE":
      return (
        <EditProfile />
      );
    case "REGISTER":
      return (
        <Register />
      );
    case "EDITOR":
      return (
        <div>
          <Col md={4} className="index">
            <NotesIndex />
          </Col>
          <Col md={8}>
            <Editor />
          </Col>
        </div>
      );
    default:
    case "LOGIN":
      return (
        <Login />
      );
    case "LOADING":
      return (
        <div>
          <Col md={3}>{' '}</Col>
          <Col md={6}><i>Loading...</i></Col>          
        </div>
      )
  }
};

const mapStateToMainProps = (state) => {
  let view = "EDITOR";
  if (state.errors.length > 0)
    view = "ERROR";
  else if (!state.user.loggedIn)
    view = "LOGIN";
  else if (state.user.loggedIn && (state.user.meFetching || state.user.profileFetching))
    view = "LOADING";
  else if (state.user.loggedIn && !state.user.registered)
    view = "REGISTER";
  else if (state.view === "PROFILE")
    view = "PROFILE";
  return {
    view
  };
}

const Main = connect(mapStateToMainProps, null)(MainView);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <div className="editorWindow container">
          <Main />
        </div>
      </div>
    );
  }
}

export default App;
