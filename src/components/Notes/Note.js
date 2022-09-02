import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { formatting } from 'nhh-styles';

import { NoteBody, NoteDescription, NoteItem, NoteLabel } from './components';

export const NoteDictionaryPropType = {
  heading: PropTypes.string.isRequired,
  labels: PropTypes.shape({
    date: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    fileUploadStatus: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export const NotePropType = {
  created: PropTypes.shape({
    on: PropTypes.string.isRequired,
    by: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
  subject: PropTypes.string,
  text: PropTypes.string,
};

const splitFileString = (str, key = 0) => {
  const item = str ? str.split('|')[key] : null;
  return item ? item.trim() : null;
};

export const Note = ({ note: { created, id, subject, text }, dictionary: { labels } }) => (
  <NoteItem key={id} data-bdd={`note-item-${id}`}>
    <NoteBody>
      <NoteLabel>{labels.date}</NoteLabel>{' '}
      <span data-bdd={`note-${id}-date`}>
        {formatting.formatDate(created.on, formatting.dateTimeFormat)}
      </span>
      <br />
      {created.by && (
        <Fragment>
          <NoteLabel>{labels.name}</NoteLabel>{' '}
          <span data-bdd={`note-${id}-name`}>{created.by}</span>
          <br />
        </Fragment>
      )}
      {splitFileString(subject, 1) && (
        <Fragment>
          <NoteLabel>{labels.filename}</NoteLabel>{' '}
          <span data-bdd={`note-${id}-filename`}>{splitFileString(subject, 1)}</span>
          <br />
        </Fragment>
      )}
      {splitFileString(subject, 2) && (
        <Fragment>
          <NoteLabel>{labels.fileUploadStatus}</NoteLabel>{' '}
          <span data-bdd={`note-${id}-fileUploadStatus`}>{splitFileString(subject, 2)}</span>
          <br />
        </Fragment>
      )}
      {text && <NoteDescription data-bdd={`note-${id}-text`}>{text}</NoteDescription>}
    </NoteBody>
  </NoteItem>
);

Note.propTypes = {
  dictionary: PropTypes.shape(NoteDictionaryPropType).isRequired,
  note: PropTypes.shape(NotePropType).isRequired,
};
