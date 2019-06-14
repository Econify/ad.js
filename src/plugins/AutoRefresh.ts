import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import ScrollMonitor from '../utils/scrollMonitor';
import GenericPlugin from './GenericPlugin';

const ONE_SECOND = 1000;

class AutoRefresh extends GenericPlugin {
  public timeInView: number = 0;
  private isRefreshing: boolean = false;

  // SetInterval Reference
  private timerReference?: number;

  public afterRender() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRefresh Plugin', 'Adding monitoring for ad.');
    this.startMonitoringViewability();
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRefresh Plugin', 'Ad viewability is being monitored.');
  }

  public beforeClear() {
    ScrollMonitor.unsubscribe(this.ad.el.id);
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRefresh Plugin', 'Ad viewability monitor has been removed.');
  }

  public beforeDestroy() {
    ScrollMonitor.unsubscribe(this.ad.el.id);
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRefresh Plugin', 'Ad viewability monitor has been removed.');
  }

  private startMonitoringViewability(): void {
    const { container, configuration: { offset = 0 }, el } = this.ad;
    ScrollMonitor.subscribe(
      el.id,
      container,
      offset,
      undefined,
      this.markAsInView,
      this.markAsOutOfView,
    );

    this.timeInView = 0;
  }

  private markAsInView = () => {
    if (this.timerReference) {
      return;
    }

    const { refreshRateInSeconds = 30 } = this.ad.configuration;
    dispatchEvent(
      this.ad.id,
      LOG_LEVELS.INFO,
      'AutoRefresh Plugin',
      `Ad is in view. Beginning timer for ${refreshRateInSeconds}.`,
    );

    this.timerReference = window.setInterval(async () => {
      this.timeInView += 1;

      // Determine whether the ad should refresh
      if (!this.isRefreshing && this.timeInView >= refreshRateInSeconds) {
        this.isRefreshing = true;

        dispatchEvent(
          this.ad.id,
          LOG_LEVELS.INFO,
          'AutoRefresh Plugin',
          `Ad viewability met. Refreshing Ad and resetting timer.`,
        );

        await this.ad.refresh();

        this.timeInView = 0;
        this.isRefreshing = false;
      }
    }, ONE_SECOND);
  }

  private markAsOutOfView = () => {
    if (!this.timerReference) {
      return;
    }

    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRefresh Plugin', 'Ad is no longer in view.');
    clearInterval(this.timerReference);
    this.timerReference = undefined;
  }
}

export default AutoRefresh;
