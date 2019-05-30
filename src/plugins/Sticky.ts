import stickybits, { StickyBits } from 'stickybits';
import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import GenericPlugin from './GenericPlugin';

class StickyPlugin extends GenericPlugin {
  public stickybit?: StickyBits;

  public onCreate() {
    const { container } = this.ad;

    const stickybit = stickybits(container);
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Sticky', `Sticky container added to ad.`);

    this.stickybit = stickybit;
  }

  public onDestroy() {
    if (this.stickybit) {
      dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Sticky', `Removed sticky container from ad.`);
      this.stickybit.cleanup();
    }

    this.stickybit = undefined;
  }
}

export = StickyPlugin;
