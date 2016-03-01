const _ = require('lodash');
/**
* Google Maps path module.
* @module create_gmaps_path
* @see module:@djforth/gmaps_helper
* Creates google map api path with relevant query strings
*
* type {function}
* @param {string} key - Google Map API Key
* @return {object} of functions to build path
*/
module.exports = function(key) {
  let gmaps = 'http://maps.google.com/maps/api/js?v=3.';
  gmaps += `&key=${key}`;
  let libraries = [];
  let region    = 'uk';
  var obj = {
    /** Add Google maps libraries - see https://developers.google.com/maps/documentation/javascript/libraries
    * @param {string} lib - Google Map Library
    * @return {object} return self
    */
    addLibrary: (lib)=>{
      libraries.push(lib);
      return obj;
    }
    /** Add region  code bias - https://developers.google.com/maps/documentation/javascript/examples/geocoding-region-es
    * @param {string} reg - Region Code
    * @return {object} return self
    */
    , addRegion: (reg)=>{
      region = reg;
      return obj;
    }
    /** Returns path
    * @param {string} cb - Callback function name (must be on global scope)
    * @return {string} return path
    */
    , getPath: (cb)=>{
      if (!_.isEmpty(libraries)) {
        gmaps += `&libraries=${libraries.join(',')}`;
      }
      gmaps += '&async=2';
      gmaps += `&region=${region}`;
      gmaps += `&callback=${cb}`;

      return gmaps;
    }
  };

  return obj;
};

// For Ref - document.body.appendChild(createScript(`http://maps.google.com/maps/api/js?v=3.&key=AIzaSyC6BXa6juoBqO_aUO9pFlNMVD3wroMdTrc&libraries=geometry&async=2&region=uk&callback=${cb_str}`);
