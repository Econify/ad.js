import { IIntersectionObserver, IIntersectionObserverEntry, IIntersectionObserverRegisteredAd } from '../types';

class ITXObserver {
  public static observer: IIntersectionObserver;
  public static registeredAds: { [key: string]: IIntersectionObserverRegisteredAd } = {};
  public static adCount: number = 0;
  public static hasViewBeenScrolled: boolean = false;

  public static monitorViewport() {
    if (ITXObserver.observer) {
      return;
    }

    window.addEventListener('scroll', ITXObserver.onFirstScroll, false);

    ITXObserver.observer = new IntersectionObserver((entries: any) => {
      ITXObserver.handleIntersect(entries);
    }, { threshold: [0, 0.25, 1] });
  }

  public static handleIntersect = (entries: IIntersectionObserverEntry[]) => {
    entries.forEach((event: IIntersectionObserverEntry) => {
      const ad = ITXObserver.registeredAds[event.target.id];

      if (ad.enableByScroll && !ITXObserver.hasViewBeenScrolled) {
        return;
      }

      const ratio = event.intersectionRatio;
      const fullyInView = ratio === 1;
      const inView = ratio > 0;

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
    });
  }

  public static subscribe = (
    id: string,
    element: HTMLElement,
    offset: number = 0,
    onEnterViewport?: () => any,
    onFullyEnterViewport?: () => any,
    onExitViewport?: () => any,
    enableByScroll?: boolean,
  ) => {
    ITXObserver.monitorViewport();

    const existingAd = ITXObserver.getAdIfExists(id);

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

    const ad: IIntersectionObserverRegisteredAd = {
      element,
      offset,
      inView: false,
      fullyInView: false,
      enableByScroll,
      onEnterViewport: onEnterViewport ? [onEnterViewport] : [],
      onFullyEnterViewport: onFullyEnterViewport ? [onFullyEnterViewport] : [],
      onExitViewport: onExitViewport ? [onExitViewport] : [],
    };

    ad.element.id = id;
    ITXObserver.registeredAds[id] = ad;
    ITXObserver.observer.observe(ad.element);
    ++ITXObserver.adCount;
  }

  public static unsubscribe = (id: string) => {
    const ad = ITXObserver.registeredAds[id];

    if (!ad) {
      return;
    }

    ITXObserver.observer.unobserve(ad.element);

    delete ITXObserver.registeredAds[id];
    --ITXObserver.adCount;
  }

  private static getAdIfExists = (id: string) => {
    return ITXObserver.registeredAds[id];
  }

  private static onFirstScroll = () => {
    ITXObserver.hasViewBeenScrolled = true;
    window.removeEventListener('scroll', ITXObserver.onFirstScroll, false);
  }
}

export default ITXObserver;
