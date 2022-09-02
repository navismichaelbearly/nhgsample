import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { PatchUserSelect } from 'nhh-styles';
import connect from './connect';

const userProp = PropTypes.shape({
  fullName: PropTypes.string,
  id: PropTypes.string,
  patchName: PropTypes.string,
});

export class PatchSelectComposition extends React.Component {
  static propTypes = {
    isHousingOfficer: PropTypes.bool,
    myPatch: userProp,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onSearch: PropTypes.func,
    teamMembers: PropTypes.arrayOf(userProp),
    visible: PropTypes.bool,
  };

  static defaultProps = {
    isHousingOfficer: false,
    visible: false,
    myPatch: {},
    teamMembers: [],
    onChange: () => {},
    onClose: () => {},
    onSearch: () => [],
  };

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
    };
  }

  handleSearch = debounce(async term => {
    const searchResults = await this.props.onSearch(term);
    this.setState({ searchResults });
  }, 500);

  render() {
    const { visible, isHousingOfficer, ...props } = this.props;
    const { searchResults } = this.state;

    if (!isHousingOfficer) {
      return null;
    }

    return (
      <PatchUserSelect
        {...props}
        applyDefaultPatch
        open={visible}
        onSearch={this.handleSearch}
        searchResults={searchResults}
      />
    );
  }
}

export default connect(PatchSelectComposition);
