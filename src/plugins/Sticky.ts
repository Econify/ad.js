import stickybits, { StickyBits } from 'stickybits';
import GenericPlugin from './GenericPlugin';

class StickyPlugin extends GenericPlugin {
  public stickybit?: StickyBits;

  public onCreate() {
    const { container } = this.ad;

    const stickybit = stickybits(container);

    this.stickybit = stickybit;
  }

  public onDestroy() {
    if (this.stickybit) {
      this.stickybit.cleanup();
    }

    this.stickybit = undefined;
  }
}

export = StickyPlugin;
