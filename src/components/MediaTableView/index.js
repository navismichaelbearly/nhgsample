import React from 'react';
import PropTypes from 'prop-types';
import identity from 'ramda/src/identity';
import { Table, Button, Loader } from 'nhh-styles';
import { shortenFileName } from '../../util/splitAndWrap';

import { SuccessWrapper, ErrorWrapper, LabelWrapper, ErrorText, TableWrapper } from './components';

const shorterName = shortenFileName(7);

const MediaTableView = ({
  files,
  onRemove,
  onRetry,
  uploadSuccessMessage,
  removeButtonLabel,
  retryButtonLabel,
  genericErrorMessage,
}) => {
  if (!files.length) return null;

  const tableData = files
    .map(file => {
      const {
        hasBeenUploaded,
        hasUploadError,
        isUploading,
        retryTimes,
        errorText,
        src: { name },
      } = file;

      const canRetry = retryTimes < 4;

      const fileNameOnDesktop = <LabelWrapper className="d-none d-lg-block">{name}</LabelWrapper>;
      const fileNameOnMobile = (
        <LabelWrapper className="d-lg-none">{shorterName(name)}</LabelWrapper>
      );

      const fileNameNode = (
        <React.Fragment>
          {fileNameOnDesktop}
          {fileNameOnMobile}
        </React.Fragment>
      );

      if (isUploading) {
        return [fileNameNode, <Loader isSmall />];
      }

      if (hasBeenUploaded) {
        return [fileNameNode, <SuccessWrapper>{uploadSuccessMessage}</SuccessWrapper>];
      }

      if (hasUploadError) {
        return [
          <div>
            {fileNameNode}
            <ErrorText>{errorText || genericErrorMessage}</ErrorText>
          </div>,
          <ErrorWrapper>
            {canRetry && (
              <Button isText onClick={() => onRetry(file)}>
                {retryButtonLabel}
              </Button>
            )}
            <Button isText onClick={() => onRemove(file)}>
              {removeButtonLabel}
            </Button>
          </ErrorWrapper>,
        ];
      }

      return [
        fileNameNode,
        <Button isText onClick={() => onRemove(file)}>
          {removeButtonLabel}
        </Button>,
      ];
    })
    .filter(identity);

  return (
    <TableWrapper>
      <Table addExtraTd={false} tdWrap data={tableData} />
    </TableWrapper>
  );
};

MediaTableView.defaultProps = {
  genericErrorMessage: null,
};

MediaTableView.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      hasBeenUploaded: PropTypes.bool,
      hasUploadError: PropTypes.bool,
      id: PropTypes.string,
      isUploading: PropTypes.bool,
      src: PropTypes.shape({
        name: PropTypes.string,
      }),
    })
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  removeButtonLabel: PropTypes.string.isRequired,
  retryButtonLabel: PropTypes.string.isRequired,
  uploadSuccessMessage: PropTypes.string.isRequired,
  genericErrorMessage: PropTypes.string,
};

export default MediaTableView;
