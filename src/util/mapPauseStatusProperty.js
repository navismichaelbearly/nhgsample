import { SCHEDULED, OPEN, DRAFT, ACTIVE } from '../constants/pause';

// this method maps status on a pause to show Active and Draft instead of Scheduled and Open
export default payload => {
  switch (payload.status) {
    case SCHEDULED: {
      return { ...payload, status: ACTIVE };
    }
    case OPEN: {
      return { ...payload, status: DRAFT };
    }
    default: {
      return payload;
    }
  }
};
