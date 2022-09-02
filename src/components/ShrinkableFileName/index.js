import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'nhh-styles';
import styled from 'styled-components';
import { shortenFileName } from '../../util/splitAndWrap';
import { LabelWrapper } from './components';

const shorterNameForDesktop = shortenFileName(26);
const shorterNameForMobile = shortenFileName(7);

const AttachmentsTableFileName = ({ name, isLink, onClick }) => {
  const ParentElement = isLink ? Button : styled.span``;
  const parentProps = isLink ? { isText: true, onClick } : {};

  return (
    <LabelWrapper>
      <ParentElement {...parentProps}>
        <span className="d-none d-lg-block">{shorterNameForDesktop(name)}</span>
        <span className="d-lg-none">{shorterNameForMobile(name)}</span>
      </ParentElement>
    </LabelWrapper>
  );
};

AttachmentsTableFileName.defaultProps = {
  isLink: false,
  onClick: () => {},
};

AttachmentsTableFileName.propTypes = {
  name: PropTypes.string.isRequired,
  isLink: PropTypes.bool,
  onClick: PropTypes.func,
};

export default AttachmentsTableFileName;
