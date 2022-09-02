import * as actions from '../../ducks/ribbon';
import * as modalActions from '../../ducks/modal';
import * as notificationActions from '../../ducks/notifications';
import * as notesActions from '../../ducks/notes';
import { mapStateToProps, mergeProps, findRentAccount } from './connect';
import state from '../../../__mocks__/state';

describe('ArrearsDetail connector', () => {
  let tmpProps;
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();

    ownProps = {
      history: {
        push: jest.fn(),
      },
      location: {
        search: '',
      },
      match: {
        params: {
          arrearsId: 'foo',
        },
      },
    };

    tmpProps = {
      arrears: mockState.arrears.items,
      notes: mockState.notes,
      breadcrumb: [
        {
          label: 'Dashboard',
          href: '#{Dashboards.Core.CustomerBaseURL}',
          id: 'breadcrumb-dashboard',
        },
        {
          label: 'My arrears',
          to: '/',
          id: 'breadcrumb-arrearsDashboard',
        },
        {
          label: 'Arrears details',
          id: 'breadcrumb-Arrears details',
        },
      ],
      heading: 'Arrears details',
    };
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      mapStateToPropsResult = mapStateToProps(mockState, ownProps);
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let result;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(),
      };
      actions.updateRibbon = jest.fn();
      modalActions.setModalContent = jest.fn();
      notificationActions.addNotification = jest.fn();
      notificationActions.removeNotification = jest.fn();
      notesActions.getNotesByCaseId = jest.fn();
      notesActions.invalidateNotes = jest.fn();
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });
    it('performs the correct actions when closeTemplate fires', () => {
      result.closeTemplate();
      expect(modalActions.setModalContent).toHaveBeenCalled();
    });

    it('performs the correct actions when openTemplate fires', () => {
      const template = 'template';
      result.openTemplate(template);
      expect(modalActions.setModalContent).toHaveBeenCalledWith(template);
    });

    it('performs the correct actions when updatePageHeader fires', () => {
      result.updatePageHeader();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(actions.updateRibbon).toHaveBeenCalledWith({
        title: tmpProps.heading,
        breadcrumb: tmpProps.breadcrumb,
      });
    });

    it('performs the correct actions when notes.invalidateNotes fires', () => {
      result.notes.invalidateList();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(notesActions.invalidateNotes).toHaveBeenCalled();
    });

    it('performs the correct actions when notes.getList fires', () => {
      result.notes.getList();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(notesActions.getNotesByCaseId).toHaveBeenCalledWith('foo');
    });

    it('performs the correct actions when addNotification fires', () => {
      const notificationProps = { description: 'Description', title: 'title' };
      result.addNotification(notificationProps);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(notificationActions.addNotification).toHaveBeenCalledWith(notificationProps);
    });

    it('performs the correct actions when removeNotification fires', () => {
      const notificationType = 'confirmation';
      result.removeNotification(notificationType);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(notificationActions.removeNotification).toHaveBeenCalledWith(notificationType);
    });
  });

  describe('findRentAccount', () => {
    it('should filter through the accounts and only take rent', () => {
      const props = {
        customer: {
          accounts: [
            {
              typeCode: 'REN',
            },
            {
              typeCode: 'OTHER',
            },
          ],
        },
      };

      expect(findRentAccount({})(props)).toEqual({
        typeCode: 'REN',
      });
    });

    describe('findRentAccount transformations', () => {
      it('should get payment frequency from the frequency mapping', () => {
        const mappings = {
          A: 'Annual',
          M: 'Monthly',
          Q: 'Quarterly',
          W: 'Weekly',
        };

        ['A', 'M', 'Q', 'W'].forEach(frequency => {
          const props = {
            customer: {
              accounts: [
                {
                  typeCode: 'REN',
                  paymentFrequency: frequency,
                },
                {
                  typeCode: 'OTHER',
                },
              ],
            },
          };

          expect(findRentAccount(mappings)(props)).toHaveProperty(
            'paymentFrequency',
            mappings[frequency]
          );
        });
      });

      it('should only return a service charge under charges', () => {
        const props = {
          customer: {
            accounts: [
              {
                typeCode: 'REN',
                charges: [
                  { chargeCode: 'SMTH', chargeValue: 10 },
                  { chargeCode: 'SERV', chargeValue: 20 },
                  { chargeCode: 'SOMEOTHER', chargeValue: 20 },
                  { chargeCode: 'FPARK', chargeValue: 20 },
                  { chargeCode: 'CPPK', chargeValue: 20 },
                ],
              },
              {
                typeCode: 'OTHER',
              },
            ],
          },
        };

        expect(findRentAccount({})(props)).toHaveProperty('charges', [
          {
            chargeCode: 'SERV',
            chargeValue: 20,
          },
          {
            chargeCode: 'FPARK',
            chargeValue: 20,
          },
          {
            chargeCode: 'CPPK',
            chargeValue: 20,
          },
        ]);
      });
    });
  });
});
