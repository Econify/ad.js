import { IAd, LOG_LEVELS } from '../types';

export default (
  id: IAd['id'],
  level: LOG_LEVELS,
  creator: string,
  message: string,
  eventData?: any,
) => {
  const event = new CustomEvent(`adjs:${id}:event`, {
    detail: {
      level,
      creator,
      message,
      data: eventData,
    },
  });

  window.dispatchEvent(event);
};
