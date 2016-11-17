import React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';

import {
  viewEditor,
  viewProfile,
  logoutUser,
} from './actions';

const NavRightView = ({
  loggedIn,
  registered,
  username,
  onProfileClick,
  onLogoutClick
}) => {
  if (loggedIn && registered) {
    return (
      <Nav pullRight>
        <Navbar.Brand>{username}</Navbar.Brand>
        <NavDropdown title="Settings" id="basic-nav-dropdown">
          <MenuItem onClick={onProfileClick}>Profile</MenuItem>
          <MenuItem divider />
          <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
        </NavDropdown>
      </Nav>
    );
  } else if (loggedIn) {
    return (
      <Nav pullRight>
        <NavDropdown title="Settings" id="basic-nav-dropdown">
          <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
        </NavDropdown>
      </Nav>
    );
  } else {
    return null;
  }
};

const mapStateToNavRightProps = (state) => {
  return {
    loggedIn: state.user.loggedIn,
    registered: state.user.registered,
    username: state.user.username
  }
};

const mapDispatchToNavRightProps = (dispatch) => {
  return {
    onProfileClick: () => dispatch(viewProfile()),
    onLogoutClick: () => dispatch(logoutUser())
  }
};

const NavRight = connect(mapStateToNavRightProps, mapDispatchToNavRightProps)(NavRightView);

const NavigationView = ({
  onEditorClick
}) => {
  return (
    <Navbar inverse>
      <Navbar.Header>
        <Navbar.Brand>
          <a onClick={onEditorClick}>Markdown Notes</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <NavRight />
      </Navbar.Collapse>
    </Navbar>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onEditorClick: () => dispatch(viewEditor())
  }
}

export const Navigation = connect(null, mapDispatchToProps)(NavigationView);
