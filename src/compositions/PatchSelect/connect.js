import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import { connect } from 'react-redux';
import { customerApi } from '../../api';
import { hidePatchSelect, setPatchList } from '../../ducks/patch';
import getHelpers from '../../util/stateHelpers';
import getPatchInfo from '../../util/getPatchInfo';

export const mapStateToProps = state => {
  const { get, isHousingOfficer } = getHelpers(state);
  const { teamMembers, visible } = get(['patch']);
  return {
    isHousingOfficer,
    myPatch: get(['user', 'profile']),
    teamMembers: teamMembers.map(m => ({ ...m, fullName: m.fullname })),
    visible,
  };
};

export const mergeProps = (stateProps, { dispatch }, ownProps) => ({
  ...stateProps,
  onClose: compose(dispatch, hidePatchSelect),
  onChange: compose(dispatch, setPatchList, map(getPatchInfo)),
  onSearch: async term => {
    const { data: housingOfficers } = await customerApi.searchForHousingOfficers(term);
    return (housingOfficers || []).map(ho => ({ ...ho, fullName: ho.fullname }));
  },
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
