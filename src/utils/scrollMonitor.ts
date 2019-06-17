import { IRegisteredAd } from '../types';
import throttle from './throttle';

const MONITORING = Symbol('MONITORING');
const ON_SCROLL = Symbol('ON_SCROLL');

class ScrollMonitor {
  public static throttleDuration: number = 100;
  public static registeredAds: { [key: string]: IRegisteredAd } = {};
  public static adCount: number = 0;

  public static monitorScroll() {
    if (ScrollMonitor[MONITORING]) {
      return;
    }

    window.addEventListener('scroll', ScrollMonitor[ON_SCROLL], false);
    ScrollMonitor[MONITORING] = true;
  }

  public static subscribe = (
    id: string,
    element: HTMLElement,
    offset: number = 0,
    onEnterViewport?: () => any,
    onFullyEnterViewport?: () => any,
    onExitViewport?: () => any,
  ) => {

    const existingAd = ScrollMonitor.getAdIfExists(id);

    if (existingAd) {
      if (onEnterViewport) {
        existingAd.onEnterViewport.push(onEnterViewport);
      }

      if (onFullyEnterViewport) {
        existingAd.onFullyEnterViewport.push(onFullyEnterViewport);
      }

      if (onExitViewport) {
        existingAd.onExitViewport.push(onExitViewport);
      }

      return;
    }

    const ad: IRegisteredAd = {
      element,
      offset,
      inView: false,
      fullyInView: false,
      onEnterViewport: onEnterViewport ? [onEnterViewport] : [],
      onFullyEnterViewport: onFullyEnterViewport ? [onFullyEnterViewport] : [],
      onExitViewport: onExitViewport ? [onExitViewport] : [],
    };

    ScrollMonitor.registeredAds[id] = ad;
    ScrollMonitor.evaulateCurrentViewability(ScrollMonitor.registeredAds[id], window.innerHeight);
    ++ScrollMonitor.adCount;
  }

  public static unsubscribe = (id: string) => {
    if (!ScrollMonitor.registeredAds[id]) {
      return;
    }

    delete ScrollMonitor.registeredAds[id];
    --ScrollMonitor.adCount;
  }

  private static [MONITORING]: boolean = false;

  private static [ON_SCROLL] = () => throttle(() => {
    if (!ScrollMonitor.adCount) {
      return;
    }

    Object.entries(ScrollMonitor.registeredAds).forEach(([key, ad]) => {
      ScrollMonitor.evaulateCurrentViewability(ad, window.innerHeight);
    });

  }, ScrollMonitor.throttleDuration)

  private static evaulateCurrentViewability = (ad: IRegisteredAd, windowHeight: number) => {
    const bounding = ad.element.getBoundingClientRect();

    const inView = (bounding.top + ad.offset) <= windowHeight && (bounding.top + bounding.height) >= 0;
    const fullyInView = bounding.top >= 0 && bounding.bottom <= windowHeight;

    if (fullyInView && !ad.fullyInView) {
      ad.onFullyEnterViewport.forEach((fn) => fn());
    }

    if (inView && !ad.inView) {
      ad.onEnterViewport.forEach((fn) => fn());
    }

    if (!inView && ad.inView) {
      ad.onExitViewport.forEach((fn) => fn());
    }

    ad.inView = inView;
    ad.fullyInView = fullyInView;
  }

  private static getAdIfExists = (id: string) => {
    return ScrollMonitor.registeredAds[id];
  }
}

ScrollMonitor.monitorScroll();

export default ScrollMonitor;
