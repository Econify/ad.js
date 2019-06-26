import { IAd, IPlugin } from '../types';

class GenericPlugin implements IPlugin {
  protected ad: IAd;

  get name(): string {
    return this.constructor.name;
  }

  constructor(ad: IAd) {
    if (!ad) {
      throw new Error(`An ad must be passed into the GenericPlugin class. If your Plugin inherits from GenericPlugin
        and overrides the constructor make sure you are calling "super" and that you are passing in an
        instance of an ad as the first parameter. Alternatively, you can hook into the onCreate method
        which gets called by the constructor.

        Example:
        js
          class ExamplePlugin extends GenericPlugin {
            onCreate() {
              console.log('Example Plugin Started Successfully');
            }
          }

          // Or

          class ExamplePlugin extends GenericPlugin {
            constructor(ad) {
              super(ad);

              console.log('Example Plugin Started Successfully');
            }
          }
      `);
    }

    this.ad = ad;
  }
}

export default GenericPlugin;
