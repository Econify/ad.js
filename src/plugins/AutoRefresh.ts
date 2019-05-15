import scrollMonitor, { IWatcher } from 'scrollmonitor';
import GenericPlugin from './GenericPlugin';

const ONE_SECOND = 1000;

class AutoRefreshPlugin extends GenericPlugin {
  public timeInView: number = 0;
  private watcher?: IWatcher;
  private isRefreshing: boolean = false;

  // SetInterval Reference
  private timerReference?: number;

  public afterRender() {
    this.startMonitoringViewability();
  }

  public beforeClear() {
    this.stopMonitoringViewability();
  }

  public beforeDestroy() {
    this.stopMonitoringViewability();
  }

  private startMonitoringViewability(): void {
    if (this.watcher) {
      return;
    }

    const { container } = this.ad;

    this.watcher = scrollMonitor.create(container);

    this.timeInView = 0;

    this.watcher.fullyEnterViewport(() => {
      this.markAsInView();
    });
  }

  private stopMonitoringViewability(): void {
    if (!this.watcher) {
      return;
    }

    this.watcher.exitViewport(() => {
      this.markAsOutOfView();

      this.watcher = undefined;
    });
  }

  private markAsInView(): void {
    if (this.timerReference) {
      return;
    }

    const { refreshRateInSeconds = 30 } = this.ad.configuration;

    this.timerReference = window.setInterval(async () => {
      this.timeInView += 1;

      // Determine whether the ad should refresh
      if (!this.isRefreshing && this.timeInView >= refreshRateInSeconds) {
        this.isRefreshing = true;

        await this.ad.refresh();

        this.timeInView = 0;
        this.isRefreshing = false;
      }
    }, ONE_SECOND);
  }

  private markAsOutOfView(): void {
    if (!this.timerReference) {
      return;
    }

    clearInterval(this.timerReference);
    this.timerReference = undefined;
  }
}

export = AutoRefreshPlugin;
