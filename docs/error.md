# Common Errors

## Error 1
Description: An ad must be passed into the GenericPlugin class. If your Plugin inherits from GenericPlugin
		and overrides the constructor make sure you are calling "super" and that you are passing in an
		instance of an ad as the first parameter. Alternatively, you can hook into the onCreate method
		which gets called by the constructor.

		Example:
		js
		
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
  
## Error 2
Description: Ad does not have an id

  
## Error 3
Description: Sizes must be defined.

  
## Error 4
Description: Ad Path must be defined.

  
## Error 5
Description: Using the Networks or Plugins property on AdJS is only available when installing via script.
If you are compiling the AdJS library locally within your project, use require to
specify the plugin directly.

Example:

 ``` 
  import DFP from 'adjs/networks/DFP';
  import AutoRender from 'adjs/plugins/AutoRender';

  new AdJS.Page(DFP, {
	plugins: [
	  AutoRender,
	],
  });
 ```
  
## Error 6
Description: The Plugin or Network has not been included in your bundle.
Please manually include the script tag associated with this plugin or network.

Example:

 ``` 
  <script src="https://cdn.adjs.dev/core.min.js"></script>
  <script src="https://cdn.adjs.dev/DFP.min.js"></script>
  <script src="https://cdn.adjs.dev/AutoRender.min.js"></script>

  <script>
	new AdJS.Page(AdJS.Networks.DFP, {
	  plugins: [
		AdJS.Plugins.AutoRender,
	  ],
	});
  </script>
 ```
  
## Error 7
Description: Sizes must be of type `Array` unless breakpoints have been specified

  