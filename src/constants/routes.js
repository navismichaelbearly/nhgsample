import devElse from '../util/devElse';
import {
  activitiesApi as activitiesApiBase,
  arrearsApi as arrearsApiBase,
  arrearsApiV2 as arrearsApiBaseV2,
  avatarsApi as avatarsApiBase,
  correspondenceApi as correspondenceApiBase,
  customerDashboard as customerDashboardBase,
  customersApi as customersApiBase,
  documentsApi as documentsApiBase,
  employeeDashboard as employeeDashboardBase,
  interactionsApi as interactionsApiBase,
  linkedCasesApi as linkedCasesApiBase,
  notesApi as notesApiBase,
  paymentsApi as paymentsApiBase,
  paymentsBaseURL as paymentsBase,
  tasksApi as tasksApiBase,
  tasksApiV2,
  sharepointApi as sharepointApiBase,
  identityApi as identityApiBase,
} from '../constants/tokens';

export const activitiesApi = devElse(
  'https://mynottinghill-dev.workwise.london/activities/web/api/v1',
  activitiesApiBase
);

export const arrearsApi = devElse(
  'https://mynottinghill-dev.workwise.london/arrears/web/api/v1',
  arrearsApiBase
);
export const arrearsApiV2 = devElse(
  'https://mynottinghill-dev.workwise.london/arrears/web/api/v2',
  arrearsApiBaseV2
);
export const identityApi = devElse(
  'https://mynottinghill-dev.workwise.london/identity/web/api/v1/',
  identityApiBase
);

export const avatarsApi = devElse(
  'https://nhhuksmedsamediad.blob.core.windows.net/employees/$id/Image/profile.jpg/profile_original.jpg',
  avatarsApiBase
);

export const correspondenceApi = devElse(
  'https://mynottinghill-dev.workwise.london/correspondence/web/api/v1/',
  correspondenceApiBase
);

export const customersApi = devElse(
  'https://mynottinghill-dev.workwise.london/customers/web/api/v1',
  customersApiBase
);

export const employeeDashboard = devElse(
  'https://mynottinghill-dev.workwise.london/dashboards/employees',
  employeeDashboardBase
);

export const employeeDashboardSearchResults = `${employeeDashboard}/search-results`;

export const customerDashboard = devElse(
  'https://mynottinghill-dev.workwise.london/dashboards/customers',
  customerDashboardBase
);

export const interactionsApi = devElse(
  'https://mynottinghill-dev.workwise.london/interactions/web/api/v1',
  interactionsApiBase
);

export const linkedCasesApi = devElse(
  'https://mynottinghill-dev.workwise.london/linkedcases/web/api/v1',
  linkedCasesApiBase
);

export const notesApi = devElse(
  'https://mynottinghill-dev.workwise.london/notes/web/api/v1',
  notesApiBase
);

export const payments = devElse(
  'https://mynottinghill-dev.workwise.london/payments/web',
  paymentsBase
);

export const paymentsApi = devElse(
  'https://mynottinghill-dev.workwise.london/payments/web/api/v1',
  paymentsApiBase
);

export const tasksApi = devElse(
  'https://mynottinghill-dev.workwise.london/tasks/web/api/v1',
  tasksApiBase
);

export const tasksApiRouteV2 = devElse(
  'https://mynottinghill-dev.workwise.london/tasks/web/api/v2',
  tasksApiV2
);

export const documentsApi = devElse(
  'https://mynottinghill-dev.workwise.london/documents/web/api/v1',
  documentsApiBase
);

export const sharepointApi = devElse(
  'https://mynottinghill-dev.workwise.london/documents/sharepoint',
  sharepointApiBase
);

export const dashboardDetailsForCustomer = customerId =>
  `${employeeDashboard}/customer/${customerId}`;
