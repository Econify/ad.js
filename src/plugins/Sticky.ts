import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import throttle from '../utils/throttle';
import GenericPlugin from './GenericPlugin';

class Sticky extends GenericPlugin {
  public sticky?: any;
  public listener?: any;
  public boundary?: any;

  public onCreate() {
    const { container } = this.ad;
    this.sticky = container;

    this.boundary = this.offset(this.sticky.parentElement);
    this.sticky.style.position = 'sticky';
    this.sticky.style.top = '0px';
    if (navigator.appName === 'Netscape') {
      const ua = navigator.userAgent;
      const re  = new RegExp('Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})');
      if (re.exec(ua) != null) {
        const rv = parseInt(RegExp.$1, 10);
        if (rv === 11) {
          this.handleIE();
        }
      }
    }

    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Sticky Plugin', `Sticky container added to ad.`);
  }

  public cleanup() {
    this.sticky.style.position = '';
    this.sticky.style.top = '';
    if (this.listener) {
      window.removeEventListener('scroll', this.listener);
    }
  }

  public offset(el: any) {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft, right: rect.right };
  }

  public handleIE() {
    if (this.boundary < window.scrollY) {
      this.boundary = this.offset(this.sticky.parentElement);
      this.sticky.style.position = 'fixed';
      this.sticky.style.top = '0px';
      this.sticky.style.transform = 'translateX(-50%)';
    }

    this.listener = window.addEventListener('scroll', () => {
      throttle(() => {
        this.boundary = this.offset(this.sticky.parentElement);
        if (this.boundary.top > window.scrollY) {
          this.sticky.style.position = '';
          this.sticky.style.top = '';
          this.sticky.style.transform = '';
        } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          this.sticky.style.top = '';
          this.sticky.style.bottom = '0px';
        } else {
          this.sticky.style.position = 'fixed';
          this.sticky.style.top = '0px';
          this.sticky.style.transform = 'translateX(-50%)';
        }
      });
    });
  }

  public onDestroy() {
    if (this.sticky) {
      dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Sticky Plugin', `Removed sticky container from ad.`);
      this.cleanup();
    }

    this.sticky = undefined;
  }
}

export default Sticky;
