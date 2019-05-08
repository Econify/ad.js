import { IAd } from '../types';

export default function onEvent(ad: IAd, fn: (event: any) => void) {
  window.addEventListener(`adjs:${ad.id}:event`, (event) => {
    fn(event);
  });
}
