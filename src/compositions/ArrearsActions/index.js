import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from 'nhh-styles';
import { withRouter } from 'react-router-dom';

import { Wrapper, MenuItemsWrapper, ItemWrapper } from './components';

import connect from './connect';

export const ArrearsActionsComposition = ({ actions }) => (
  <Wrapper>
    <Box data-bdd="SideBar">
      <MenuItemsWrapper>
        {actions.map(action => (
          <ItemWrapper key={action.dataBdd}>
            <Button
              data-bdd={`SideBar-${action.dataBdd}`}
              to={action.link || null}
              href={action.href || null}
              isFullWidth
            >
              {action.text}
            </Button>
          </ItemWrapper>
        ))}
      </MenuItemsWrapper>
    </Box>
  </Wrapper>
);

ArrearsActionsComposition.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      dataBdd: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
};

export default withRouter(connect(ArrearsActionsComposition));
