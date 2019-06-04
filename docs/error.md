# Common Errors
### 1:  An ad must be passed into the GenericPlugin class. 
 If your Plugin inherits from GenericPlugin
		and overrides the constructor make sure you are calling "super" and that you are passing in an
		instance of an ad as the first parameter. Alternatively, you can hook into the onCreate method
		which gets called by the constructor.

		Example:
		 
 ``` 
  class ExamplePlugin extends GenericPlugin {
			onCreate() {
			  console.log('Example Plugin Started Succesfully');
			}
		  }

		  // Or

		  class ExamplePlugin extends GenericPlugin {
			constructor(ad) {
			  super(ad);

			  console.log('Example Plugin Started Succesfully');
			}
		  }
 ``` 
### 2:  Dynamic requires are not currently supported by rollup-plugin-commonjs 
