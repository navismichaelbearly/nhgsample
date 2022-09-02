import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'nhh-styles';
import format from 'string-format';

import { Wrapper, H3 } from './components';
import { Note, NotePropType, NoteDictionaryPropType } from './';

const NoteList = ({ notes, text }) => (
  <Wrapper data-bdd="NoteList">
    <H3>{format(text.heading, { count: notes.length })}</H3>
    <Pagination
      items={notes}
      pageSize={5}
      render={items => items.map(item => <Note note={item} dictionary={text} key={item.id} />)}
    />
  </Wrapper>
);

NoteList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape(NotePropType)).isRequired,
  text: PropTypes.shape(NoteDictionaryPropType).isRequired,
};

export default NoteList;
