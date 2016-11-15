import React from 'react';
import { ControlLabel, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';

import {
  addNote,
  deleteNote,
  switchNote
} from './actions';

const NotesIndexView = ({
  notes,
  activeId,
  deleteAllowed,
  onAddClick,
  onDeleteClick,
  onSelectClick
}) => {
  return (
    <div>
      <ControlLabel>Notes Index:</ControlLabel>
      <div className="spacer">
        <Button className="halfSize" bsStyle="success" onClick={onAddClick}>Add</Button>
        <div className="widthSpacer">{' '}</div>
        <Button className="halfSize" bsStyle="danger" onClick={() => onDeleteClick(activeId)} disabled={!deleteAllowed}>Delete</Button>
      </div>
      <ListGroup>
        {notes.map(note =>
          <ListGroupItem key={note.id} onClick={() => onSelectClick(note.id)} active={activeId === note.id}>{note.title}</ListGroupItem>
        )}
      </ListGroup>
    </div>
  );
};

const mapStateToNotesIndexProps = (state) => {
  return {
    notes: state.notesIndex,
    activeId: state.activeId,
    deleteAllowed: !!state.activeId
  };
}

const mapDispatchToNotesIndexProps = (dispatch) => {
  return {
    onAddClick: () => dispatch(addNote()),
    onDeleteClick: (id) => dispatch(deleteNote(id)),
    onSelectClick: (id) => dispatch(switchNote(id))
  };
};

export const NotesIndex = connect(
  mapStateToNotesIndexProps,
  mapDispatchToNotesIndexProps
)(NotesIndexView);
