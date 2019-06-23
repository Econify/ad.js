import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import Dash from '../utils/lodash';
import GenericPlugin from './GenericPlugin';

class Sticky extends GenericPlugin {
  public sticky?: any;
  public listener?: any;
  public boundary?: any;

  public onCreate() {
    const { container } = this.ad;
    this.sticky = container;

    this.boundary = this.offset(this.sticky.parentElement).top;
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
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  public handleIE() {
    if (this.boundary < window.scrollY) {
      this.sticky.style.position = 'fixed';
      this.sticky.style.top = '0px';
    }

    this.listener = window.addEventListener('scroll', Dash.throttle((e: any) => {
      this.boundary = this.offset(this.sticky.parentElement).top;
      if (this.boundary > window.scrollY) {
        this.sticky.style.position = '';
        this.sticky.style.top = '';
      } else {
        this.sticky.style.position = 'fixed';
        this.sticky.style.top = '0px';
      }
    }, 150));
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
