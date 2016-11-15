import React from 'react';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import marked from 'marked';

import {
  changeTitle,
  changeMarkdown,
  saveNote
} from './actions';

const SaveButtonView = ({
  dirty,
  disableSaving,
  id,
  onSave
}) => {
  if (!dirty)
    return (
      <div />
    );

  return (
    <div style={{ textAlign: "right" }}>
      <Button bsSize="small" onClick={() => onSave(id)} disabled={disableSaving}>Save note</Button>
    </div>
  );
};

const mapStateToSaveButtonProps = (state) => {
  return {
    dirty: state.notes[state.activeId].dirty,
    disableSaving: state.notes[state.activeId].isSaving || state.notes[state.activeId].loadError,
    id: state.activeId
  };
};

const mapDispatchToSaveButtonProps = (dispatch) => {
  return {
    onSave: (id) => dispatch(saveNote(id))
  }
};

const SaveButton = connect(mapStateToSaveButtonProps, mapDispatchToSaveButtonProps)(SaveButtonView);

const EditorView = ({
  note,
  onChangeTitle,
  onChangeMarkdown
}) => {
  if (!note) {
    return (
      <div>
        <br />
        <p><i>Add/select a note to edit.</i></p>
      </div>
    );
  }

  if (note.loadError) {
    return (
      <div>
        <br />
        <p><i>This note could not be loaded from the server. Please reload the application.</i></p>
        <p><strong>Sorry!</strong></p>
      </div>
    );
  }

  return (
    <div>
      <div className="editor">
        <FormGroup controlId="formControlTitle">
          <ControlLabel>Title:</ControlLabel>
          <FormControl componentClass="input" placeholder="Enter title" value={note.title} onChange={() => onChangeTitle(note.id, document.getElementById("formControlTitle").value)} />
        </FormGroup>
        <FormGroup controlId="formControlMarkdown">
          <ControlLabel>Markdown Code:</ControlLabel>
          <FormControl componentClass="textarea" placeholder="textarea" value={note.markdown} onChange={() => onChangeMarkdown(note.id, document.getElementById("formControlMarkdown").value)} />
        </FormGroup>
        <SaveButton />
      </div>
      <div className="markdown">
        <ControlLabel>Rendered Markdown:</ControlLabel>
        <div dangerouslySetInnerHTML={{ __html: marked(note.markdown) }} />
      </div>
    </div>
  );
};

const mapStateToEditorProps = (state) => {
  return {
    note: state.activeId ? state.notes[state.activeId] : null
  };
};

const mapStateToEditorDispatch = (dispatch) => {
  return {
    onChangeTitle: (id, title) => dispatch(changeTitle(id, title)),
    onChangeMarkdown: (id, markdown) => dispatch(changeMarkdown(id, markdown))
  };
};

export const Editor = connect(
  mapStateToEditorProps,
  mapStateToEditorDispatch)(EditorView);
