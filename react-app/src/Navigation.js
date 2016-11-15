import React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';

import { 
    viewEditor, 
    viewProfile,
    logoutUser, 
} from './actions';

const NavigationView = ({
  onEditorClick,
  onProfileClick,
  onLogoutClick
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
        <Nav pullRight>
          <NavDropdown title="Settings" id="basic-nav-dropdown">
            <MenuItem onClick={onProfileClick}>Profile</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

const mapDispatchToNavigationProps = (dispatch) => {
  return {
    onEditorClick: () => dispatch(viewEditor()),
    onProfileClick: () => dispatch(viewProfile()),
    onLogoutClick: () => dispatch(logoutUser())
  } 
}

export const Navigation = connect(null, mapDispatchToNavigationProps)(NavigationView);
