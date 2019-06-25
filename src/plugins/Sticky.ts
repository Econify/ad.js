import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import throttle from '../utils/throttle';
import GenericPlugin from './GenericPlugin';

interface IBoundary {
  top: number;
  left: number;
  right: number;
}

function getElementOffset(el: any): IBoundary {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return { top: rect.top + scrollTop, left: rect.left + scrollLeft, right: rect.right };
}

class Sticky extends GenericPlugin {
  public sticky?: HTMLElement;
  public listener?: any;
  public boundary?: IBoundary;
  public originalStyle?: any;

  public onCreate() {
    const { container } = this.ad;
    this.originalStyle = container.style;
    this.boundary = getElementOffset(container.parentElement);

    container.style.position = 'sticky';
    container.style.top = '0px';

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
    const { container } = this.ad;

    container.style.position = this.originalStyle.position;
    container.style.top = this.originalStyle.top;
    container.style.transform = this.originalStyle.transform;

    if (this.listener) {
      window.removeEventListener('scroll', this.listener);
    }
  }

  public onDestroy() {
    this.cleanup();

    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Sticky Plugin', `Removed sticky container from ad.`);
  }

  private handleIE() {
    const { container } = this.ad;

    if (this.boundary && this.boundary.top < window.scrollY) {
      this.boundary = getElementOffset(container.parentElement);
      container.style.position = 'fixed';
      container.style.top = '0px';
      container.style.transform = 'translateX(-50%)';
    }

    this.listener = window.addEventListener('scroll', () => {
      throttle(() => {
        this.boundary = getElementOffset(container.parentElement);
        if (this.boundary.top > window.scrollY) {
          container.style.position = this.originalStyle.position;
          container.style.top = this.originalStyle.top;
          container.style.transform = this.originalStyle.transform;
        } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          container.style.top = '';
          container.style.bottom = '0px';
          container.style.transform = 'translateX(-50%)';
        } else {
          container.style.position = 'fixed';
          container.style.top = '0px';
          container.style.transform = 'translateX(-50%)';
        }
      });
    });
  }
}

export default Sticky;
