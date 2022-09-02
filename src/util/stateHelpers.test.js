import getHelpers from './stateHelpers';
import state from '../../__mocks__/state';

describe('stateHelpers', () => {
  const mockState = state();

  describe('Given user is customer', () => {
    const { get, dictionary, getString, getBreadcrumbs, isHousingOfficer, pickFrom } = getHelpers(
      mockState
    );

    it('should get the dictionary', () => {
      expect(dictionary).toMatchObject(mockState.dictionary);
    });

    it('should check if user is housing officer', () => {
      expect(isHousingOfficer).toBeFalsy();
    });

    it('should get the value from a path', () => {
      expect(get(['user', 'profile', 'name'])).toBe(mockState.user.profile.name);
    });

    it('should get the subset object from the state', () => {
      expect(pickFrom(['downloadedFiles', 'downloadError', 'loading', 'loaded'], 'media')).toEqual({
        downloadError: null,
        downloadedFiles: [],
        loaded: false,
        loading: false,
      });
    });

    it('should get string regardless of user type', () => {
      expect(getString(['dashboard'])).toBe(mockState.dictionary.dashboard);
    });

    it('should get string based on user type', () => {
      expect(getString(['arrearsDashboard', 'heading'])).toBe(
        mockState.dictionary.arrearsDashboard.customerHeading
      );
    });

    it('should get breadcrumbs with no keys', () => {
      expect(getBreadcrumbs()).toEqual([
        {
          label: mockState.dictionary.dashboard,
          href: '#{Dashboards.Core.CustomerBaseURL}',
          id: 'breadcrumb-dashboard',
        },
        {
          label: mockState.dictionary.arrearsDashboard.customerHeading,
          to: '/',
          id: 'breadcrumb-arrearsDashboard',
        },
      ]);
    });

    it('should get breadcrumbs with dictionary path key based on user type', () => {
      const key = ['arrearsDashboard', 'heading'];
      expect(getBreadcrumbs(key)).toEqual([
        {
          label: mockState.dictionary.dashboard,
          href: '#{Dashboards.Core.CustomerBaseURL}',
          id: 'breadcrumb-dashboard',
        },
        {
          label: mockState.dictionary.arrearsDashboard.customerHeading,
          id: `breadcrumb-${mockState.dictionary.arrearsDashboard.customerHeading}`,
        },
      ]);
    });

    it('should get breadcrumbs with string', () => {
      const crumb = 'Hello world';
      expect(getBreadcrumbs(crumb)).toEqual([
        {
          label: mockState.dictionary.dashboard,
          href: '#{Dashboards.Core.CustomerBaseURL}',
          id: 'breadcrumb-dashboard',
        },
        {
          label: mockState.dictionary.arrearsDashboard.customerHeading,
          to: '/',
          id: 'breadcrumb-arrearsDashboard',
        },
        { label: crumb, id: `breadcrumb-${crumb}` },
      ]);
    });
  });

  describe('Given user is housing officer', () => {
    let mockHoState;
    let helpers;

    beforeEach(() => {
      mockHoState = { ...mockState };
      mockHoState.user.profile.isHousingOfficer = true;
      helpers = getHelpers(mockHoState);
    });

    it('should check if user is housing officer', () => {
      expect(helpers.isHousingOfficer).toBe(true);
    });

    it('should get string based on user type', () => {
      expect(helpers.getString(['arrearsDashboard', 'heading'])).toBe(
        mockState.dictionary.arrearsDashboard.housingOfficerHeading
      );
    });

    describe('When breadcrumbs is requested without customer profile', () => {
      let breadcrumbs;
      const key = ['arrearsDashboard', 'heading'];

      beforeEach(() => {
        breadcrumbs = helpers.getBreadcrumbs(key);
      });

      it('should get the breadcrumbs for without customer name', () => {
        expect(breadcrumbs).toEqual([
          {
            label: mockState.dictionary.dashboard,
            href: '#{Dashboards.Core.EmployeeBaseURL}',
            id: 'breadcrumb-dashboard',
          },
          {
            label: mockState.dictionary.arrearsDashboard.housingOfficerHeading,
            id: `breadcrumb-${mockState.dictionary.arrearsDashboard.housingOfficerHeading}`,
          },
        ]);
      });
    });

    describe('When breadcrumb is requested with customer profile', () => {
      let breadcrumbs;
      const key = ['arrearsDashboard', 'heading'];

      beforeEach(() => {
        breadcrumbs = helpers.getBreadcrumbs(key, mockState.customer.profile);
      });

      it('should get the breadcrumbs for with customer name', () => {
        expect(breadcrumbs).toEqual([
          {
            label: mockState.dictionary.dashboard,
            href: '#{Dashboards.Core.EmployeeBaseURL}',
            id: 'breadcrumb-dashboard',
          },
          {
            label: mockState.customer.profile.fullName,
            href: `#{Dashboards.Core.EmployeeBaseURL}/customer/${mockState.customer.profile.id}`,
            id: 'breadcrumb-customerName',
          },
          {
            label: mockState.dictionary.arrearsDashboard.housingOfficerHeading,
            id: `breadcrumb-${mockState.dictionary.arrearsDashboard.housingOfficerHeading}`,
          },
        ]);
      });
    });
  });
});
