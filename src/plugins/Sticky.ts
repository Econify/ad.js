import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import throttle from '../utils/throttle';
import GenericPlugin from './GenericPlugin';

interface IBoundary {
  top: number;
  left: number;
  right: number;
}

function getElementOffset(el: HTMLElement): IBoundary {
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
    if (!this.isEnabled('sticky')) {
      return;
    }

    const { container, configuration } = this.ad;
    const { stickyOffset = 0 } = configuration;
    this.originalStyle = container.style;

    container.style.position = 'sticky';
    container.style.top = `${stickyOffset}px`;

    if (container.parentElement) {
      this.boundary = getElementOffset(container.parentElement);
      if (navigator.appName === 'Netscape') {
        const ua = navigator.userAgent;
        const re  = new RegExp('Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})');
        if (re.exec(ua) != null) {
          const rv = parseInt(RegExp.$1, 10);
          if (rv === 11) {
            this.handleIE(stickyOffset);
          }
        }
      }
    } else {
      return;
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
    if (!this.isEnabled('sticky')) {
      return;
    }

    this.cleanup();

    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Sticky Plugin', `Removed sticky container from ad.`);
  }

  private handleIE(offset: number) {
    const { container } = this.ad;

    const parentElement = container.parentElement;

    if (!parentElement) {
      throw new Error('Parent element required for sticky plugin.');
    }

    if (this.boundary && this.boundary.top < window.scrollY) {
      this.boundary = getElementOffset(parentElement);
      container.style.position = 'fixed';
      container.style.top = `${offset}px`;
      container.style.transform = 'translateX(-50%)';
    }

    this.listener = window.addEventListener('scroll', () => {
      throttle(() => {
        this.boundary = getElementOffset(parentElement);
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
          container.style.top = `${offset}px`;
          container.style.transform = 'translateX(-50%)';
        }
      });
    });
  }
}

export default Sticky;
