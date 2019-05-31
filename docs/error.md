# Common Errors
 Misconfiguration 	    Dynamic requires are not currently supported by rollup-plugin-commonjs undefined undefined Misconfiguration 	    Dynamic requires are not currently supported by rollup-plugin-commonjs undefined undefined Misconfiguration 	    Misconfiguration 	    Misconfiguration 	    Misconfiguration 	    Misconfiguration 	    Malformed Request Ad does not have an id Malformed Request Sizes must be defined. Malformed Request Ad Path must be defined. 
Using the Networks or Plugins property on AdJS is only available when installing via script.
If you are compiling the AdJS library locally within your project, use require to
specify the plugin directly.

Example:
  import DFP from 'adjs/networks/DFP';
  import AutoRender from 'adjs/plugins/AutoRender';

  new AdJS.Bucket(DFP, {
    plugins: [
      AutoRender,
    ],
  });
       
The  Misconfiguration Sizes must be of type `Array` unless breakpoints have been specified Generator is already executing. Symbol.asyncIterator is not defined. Symbol.asyncIterator is not defined.