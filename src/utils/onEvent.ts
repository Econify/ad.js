import { IAd } from '../types';

export default function onEvent(id: IAd['id'], fn: (event: any) => void) {
  window.addEventListener(`adjs:${id}:event`, (event) => {
    fn(event);
  });
}
