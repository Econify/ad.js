# Common Errors

## Error Code 1:
Description: Using the Networks or Plugins property on AdJS is only available when installing via script.
If you are compiling the AdJS library locally within your project, use require to
specify the plugin directly.

Example:
  import DFP from 'adjs/networks/DFP';
  import AutoRender from 'adjs/plugins/AutoRender';

  new AdJS.Page(DFP, {
	plugins: [
	  AutoRender,
	],
  });
 ```

## Error Code 2:
Description: The Plugin or Network has not been included in your bundle.
Please manually include the script tag associated with this plugin or network.

Example:
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

## Error Code 10:

Description: Generator is already executing.


## Error Code 13:

Description: Using the Networks or Plugins property on AdJS is only available when installing via script.
If you are compiling the AdJS library locally within your project, use require to
specify the plugin directly.

Example:
  import DFP from 'adjs/networks/DFP';
  import AutoRender from 'adjs/plugins/AutoRender';

  new AdJS.Page(DFP, {
	plugins: [
	  AutoRender,
	],
  });

## Error Code 17:

Description: Symbol.asyncIterator is not defined.


## Error Code 18:

Description: Symbol.asyncIterator is not defined.


## Error Code 14:

Description: The Plugin or Network has not been included in your bundle.
Please manually include the script tag associated with this plugin or network.

Example:
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

## Error Code 15:

Description: Sizes must be of type `Array` unless breakpoints have been specified


## Error Code 16:

Description: Generator is already executing.
