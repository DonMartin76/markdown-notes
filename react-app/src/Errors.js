import React from 'react';
import { Col, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';

const ErrorsView = ({
  errors
}) => {
  return (
    <div>
      <Col md={3}>{' '}</Col>
      <Col md={6}>
        <Panel header="Error" bsStyle="danger">
          <h4>Errors have occurred while initializing the component:</h4>

          <ul>
            {errors.map(err => 
              <li>{err}</li>)}
          </ul>

        </Panel>
      </Col>
    </div>
      )
};

const mapStateToProps = (state) => {
  return {
        errors: state.errors
  };
};

export const Errors = connect(mapStateToProps, null)(ErrorsView);
