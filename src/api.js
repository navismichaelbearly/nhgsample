import {
  ActivitiesApi,
  ArrearsApi,
  CorrespondenceApi,
  CustomerApi,
  DocumentsApi,
  InteractionsApi,
  LinkedCasesApi,
  NotesApi,
  PaymentsApi,
  TasksApi,
  IdentityApi,
} from 'nhh-styles';
import {
  activitiesApi as activitiesApiBase,
  arrearsApi as arrearsApiBase,
  arrearsApiV2 as arrearsApiBaseV2,
  correspondenceApi as correspondenceApiBase,
  customersApi as customersApiBase,
  documentsApi as documentsBaseApi,
  interactionsApi as interactionsApiBase,
  linkedCasesApi as linkedCasesApiBase,
  notesApi as notesApiBase,
  paymentsApi as paymentsApiBase,
  sharepointApi as sharepointApiBase,
  tasksApi as tasksApiBase,
  tasksApiRouteV2,
  identityApi as identityApiBase,
} from './constants/routes';

export const activitiesApi = new ActivitiesApi({ baseURL: activitiesApiBase });
export const arrearsApi = new ArrearsApi({ baseURL: arrearsApiBase });
export const arrearsApiV2 = new ArrearsApi({ baseURL: arrearsApiBaseV2 });
export const correspondenceApi = new CorrespondenceApi({ baseURL: correspondenceApiBase });
export const customerApi = new CustomerApi({ baseURL: customersApiBase });
export const documentsApi = new DocumentsApi({ baseURL: documentsBaseApi });
export const interactionsApi = new InteractionsApi({ baseURL: interactionsApiBase });
export const linkedCasesApi = new LinkedCasesApi({ baseURL: linkedCasesApiBase });
export const notesApi = new NotesApi({ baseURL: notesApiBase });
export const paymentsApi = new PaymentsApi({ baseURL: paymentsApiBase });
export const tasksApi = new TasksApi({ baseURL: tasksApiBase });
export const tasksApiV2 = new TasksApi({ baseURL: tasksApiRouteV2 });
export const sharepointApi = new DocumentsApi({ baseURL: sharepointApiBase, responseType: 'blob' });
export const identityApi = new IdentityApi({ baseURL: identityApiBase });
