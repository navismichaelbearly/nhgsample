import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import format from 'string-format';
import { Box, Pagination, formatting } from 'nhh-styles';
import { withTheme } from 'styled-components';

import {
  H3,
  Link,
  Container,
  Header,
  Row,
  Column,
  DesktopView,
  MobileAndTabletView,
  DateField,
  ErrorMessage,
} from './components';

export const DocumentsList = ({ labels, dataBdd, documents, downloadFile, error }) => {
  if (error.errorCode) {
    return (
      <Fragment>
        <H3>{format(labels.heading, { count: 0 })}</H3>
        <ErrorMessage>{error.message}</ErrorMessage>
      </Fragment>
    );
  }
  return (
    <div>
      <H3>{format(labels.heading, { count: documents.length })}</H3>
      {documents.length ? (
        <Box data-bdd={dataBdd}>
          <Container>
            <DesktopView>
              <Header>
                <Column width="60%">{labels.filename}</Column>
                <Column width="20%">{labels.user}</Column>
                <Column width="20%" align={'right'}>
                  {labels.date}
                </Column>
              </Header>
            </DesktopView>
            <MobileAndTabletView>
              <Header>
                <Column width="60%">{labels.filename}</Column>
                <Column width="40%" align={'right'}>
                  {labels.date}
                </Column>
              </Header>
            </MobileAndTabletView>
            <Pagination
              items={documents}
              pageSize={10}
              render={items =>
                items.map(({ name, createdOn, uri, createdBy }, idx) => {
                  const rowIdxDataBdd = `${dataBdd}-row${idx + 1}`;
                  return (
                    <div data-bdd={rowIdxDataBdd} key={name}>
                      <DesktopView>
                        <Row>
                          <Column data-bdd={`${rowIdxDataBdd}-name`} width="60%">
                            <Link
                              data-bdd={`${rowIdxDataBdd}-link-${uri}`}
                              onClick={() => downloadFile(uri, name)}
                              to={'#'}
                              isText
                            >
                              {name}
                            </Link>
                          </Column>
                          <Column data-bdd={`${rowIdxDataBdd}-user`} width="20%">
                            <div>{createdBy}</div>
                          </Column>
                          <Column data-bdd={`${rowIdxDataBdd}-date`} width="20%" align={'right'}>
                            <DateField>
                              {formatting.formatDate(createdOn, formatting.dateFormat)}
                            </DateField>
                          </Column>
                        </Row>
                      </DesktopView>
                      <MobileAndTabletView>
                        <Row>
                          <Column data-bdd={`${rowIdxDataBdd}-name`} width="60%">
                            <Link
                              data-bdd={`${rowIdxDataBdd}-link-${uri}`}
                              onClick={() => downloadFile(uri, name)}
                              to={'#'}
                              isText
                            >
                              {name}
                            </Link>
                          </Column>
                          <Column data-bdd={`${rowIdxDataBdd}-date`} width="40%" align={'right'}>
                            <DateField>
                              {formatting.formatDate(createdOn, formatting.dateFormat)}
                            </DateField>
                          </Column>
                        </Row>
                      </MobileAndTabletView>
                    </div>
                  );
                })
              }
            />
          </Container>
        </Box>
      ) : null}
    </div>
  );
};

DocumentsList.defaultProps = {
  dataBdd: 'arrears-detail-documents-list',
};

DocumentsList.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      createdBy: PropTypes.string.isRequired,
      createdOn: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      uri: PropTypes.string.isRequired,
    })
  ).isRequired,
  downloadFile: PropTypes.func.isRequired,
  error: PropTypes.shape({
    errorStatus: PropTypes.number,
    message: PropTypes.string,
  }).isRequired,
  labels: PropTypes.shape({}).isRequired,
  dataBdd: PropTypes.string,
};

export default withTheme(DocumentsList);
