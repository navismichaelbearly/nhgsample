import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import pathOr from 'ramda/src/pathOr';

import {
  Container,
  defaultTheme,
  Footer,
  Header,
  MediaProvider,
  Modal,
  PrivateRoute,
} from 'nhh-styles';

import { getActivityHistoryItemRoute } from '../../constants/internalRoutes';
import { employeeDashboardSearchResults } from '../../constants/routes';

import {
  ActivityHistoryItem,
  AddNote,
  AddTask,
  ApproveLegalCaseReferral,
  ApprovePause,
  ArrearsDashboard,
  ArrearsDetail,
  CreateInteraction,
  CreateLegalCaseReferral,
  CustomiseCorrespondence,
  CreatePaymentPlan,
  LoginPrompt,
  MediaUploader,
  PatchSelect,
  PauseArrearsCase,
  ReferArrearsCase,
  ReviewLegalCaseReferral,
  SendCorrespondence,
  ViewPaymentPlan,
  ArchivedTasks,
  WelfareReformDetails,
} from '../../compositions';

import connect from './connect';

export class AppComposition extends PureComponent {
  componentDidMount() {
    this.props.setEntryPoint(pathOr('/', ['location', 'pathname'], this.props.history));
  }

  render() {
    const {
      history: { location },
      login,
      logout,
      user,
      modal,
    } = this.props;

    const routeProps = {
      exact: true,
      location,
      ready: user.initialised && !user.waiting,
      user,
    };

    const isLoggedUserHousingOfficer = user.profile && user.profile.isHousingOfficer;
    const redirectToSearch = term => {
      window.location.href = `${employeeDashboardSearchResults}/${term}`;
    };
    const onSearchEnabledForHousingOfficerOnly = isLoggedUserHousingOfficer
      ? redirectToSearch
      : undefined;

    return (
      <Switch>
        <Route component={LoginPrompt} path="/login" />
        <MediaProvider>
          <ThemeProvider theme={defaultTheme}>
            <Container>
              <Header
                onClickLogin={login}
                onClickLogout={logout}
                onSearch={onSearchEnabledForHousingOfficerOnly}
                isLoggedIn={user.loggedIn}
                username={user.profile && (user.profile.name || user.profile.fullname)}
                outerClass="container-fluid"
                innerClass="container"
                isHousingOfficer
              />
              <Switch>
                <PrivateRoute component={ArrearsDashboard} path="/" {...routeProps} />
                <PrivateRoute
                  component={ArrearsDetail}
                  path="/arrears-details/:arrearsId"
                  {...routeProps}
                />
                <PrivateRoute
                  component={CreateInteraction}
                  path="/arrears-details/:arrearsId/interaction/create"
                  {...routeProps}
                />
                <PrivateRoute
                  component={MediaUploader}
                  path="/arrears-details/:arrearsId/:type/:typeId/attachments"
                  {...routeProps}
                />
                <PrivateRoute
                  component={CreateLegalCaseReferral}
                  path="/arrears-details/:arrearsId/legal-case-referral/create"
                  {...routeProps}
                />
                <PrivateRoute
                  component={ReviewLegalCaseReferral}
                  path="/arrears-details/:arrearsId/legal-case-referral/:submissionId/review"
                  {...routeProps}
                />
                <PrivateRoute
                  component={ApproveLegalCaseReferral}
                  path="/arrears-details/:arrearsId/legal-case-referral/:submissionId/approve"
                  {...routeProps}
                />
                <PrivateRoute
                  component={CreatePaymentPlan}
                  path="/arrears-details/:arrearsId/payment-plan/create"
                  {...routeProps}
                />
                <PrivateRoute
                  component={ViewPaymentPlan}
                  path="/arrears-details/:arrearsId/payment-plan/:paymentPlanId"
                  {...routeProps}
                />
                <PrivateRoute
                  component={ReferArrearsCase}
                  path="/arrears-details/:arrearsId/refer-arrears-case/create"
                  {...routeProps}
                />
                <PrivateRoute
                  component={SendCorrespondence}
                  path="/arrears-details/:arrearsId/send-correspondence/create"
                  {...routeProps}
                />
                <PrivateRoute
                  component={CustomiseCorrespondence}
                  path="/arrears-details/:arrearsId/send-correspondence/:correspondenceId"
                  {...routeProps}
                />
                <PrivateRoute
                  component={PauseArrearsCase}
                  path="/arrears-details/:arrearsId/pause-arrears-case/create"
                  {...routeProps}
                />
                <PrivateRoute
                  component={ApprovePause}
                  path="/arrears-details/:arrearsId/pause-arrears-case/:pauseId/approve"
                  redirectTo="/"
                  userTypes={['manager']}
                  {...routeProps}
                />
                <PrivateRoute
                  component={PauseArrearsCase}
                  path="/arrears-details/:arrearsId/pause-arrears-case/:pauseId/update"
                  {...routeProps}
                />
                <PrivateRoute
                  component={AddNote}
                  path="/arrears-details/:arrearsId/note/create"
                  {...routeProps}
                />
                <PrivateRoute
                  component={AddTask}
                  path="/arrears-details/:arrearsId/task/create"
                  {...routeProps}
                />
                <PrivateRoute
                  component={ArchivedTasks}
                  path="/arrears-details/:arrearsId/archived-tasks"
                  {...routeProps}
                />
                <PrivateRoute
                  component={ActivityHistoryItem}
                  path={getActivityHistoryItemRoute()}
                  {...routeProps}
                />
                <PrivateRoute
                  component={WelfareReformDetails}
                  path="/arrears-details/:arrearsId/welfare-reform-details"
                  {...routeProps}
                />
                <PrivateRoute
                  component={WelfareReformDetails}
                  path="/:id/welfare-reform-details/:tenancyId"
                  {...routeProps}
                />
              </Switch>
              <Footer outerClass="container-fluid" innerClass="container" />
              <Modal {...modal} />
              <PatchSelect />
            </Container>
          </ThemeProvider>
        </MediaProvider>
      </Switch>
    );
  }
}

AppComposition.defaultProps = {
  user: {
    loggedIn: false,
    profile: {
      name: '',
    },
  },
  modal: null,
};

AppComposition.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  setEntryPoint: PropTypes.func.isRequired,
  modal: PropTypes.shape(Modal.propTypes),
  user: PropTypes.shape({
    initialised: PropTypes.bool,
    loggedIn: PropTypes.bool,
    profile: PropTypes.shape({
      fullname: PropTypes.string,
      name: PropTypes.string,
    }),
    waiting: PropTypes.bool,
  }),
};

export default withRouter(connect(AppComposition));
