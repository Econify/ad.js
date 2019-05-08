import { IAd } from '../types';

export default function dispatchEvent(ad: IAd, creator: string, eventType: string, eventData?: any) {
  const event = new CustomEvent(`adjs:${ad.id}:event`, {
    detail: {
      type: eventType,
      creator,
      data: eventData || {},
    },
  });

  window.dispatchEvent(event);
}
