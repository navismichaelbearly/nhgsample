import { Typography } from 'nhh-styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Img, MainButton } from './components';
import { ButtonRow } from '../';
import { BASE64IMAGE, TEXT, HTML } from '../../constants/previewTemplateTypes';

const PreviewTemplate = ({ content, dataBddPrefix, errorMessage, onClose, label, type }) => {
  let contentElement;
  switch (type) {
    case BASE64IMAGE:
      contentElement = (
        <Img alt="" data-bdd={`${dataBddPrefix}-image`} src={`data:image/jpeg;base64,${content}`} />
      );
      break;
    case TEXT:
      contentElement = <Typography.P>{content}</Typography.P>;
      break;
    case HTML:
      // eslint-disable-next-line react/no-danger
      contentElement = <div dangerouslySetInnerHTML={{ __html: content }} />;
      break;
    default:
  }
  const showError = !content;
  return (
    <div data-bdd={`${dataBddPrefix}-template`}>
      <ButtonRow isCenter>
        <MainButton
          data-bdd={`${dataBddPrefix}-template-close`}
          data-state-key={'template-close'}
          onClick={onClose}
        >
          {label}
        </MainButton>
      </ButtonRow>
      {showError ? (
        <Typography.P data-bdd={`${dataBddPrefix}-template-notFound`}>{errorMessage}</Typography.P>
      ) : (
        contentElement
      )}
    </div>
  );
};

PreviewTemplate.defaultProps = {
  content: '',
  dataBddPrefix: '',
  type: '',
};

PreviewTemplate.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.string,
  dataBddPrefix: PropTypes.string,
  type: PropTypes.string,
};

export default PreviewTemplate;
