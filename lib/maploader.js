'use strict';

var _ = require('lodash/core');
/** Creates Script tag to load api code */
function createScript(path, id) {
  var script = document.createElement('script');
  script.id = id;
  script.type = 'text/javascript';
  script.src = path;

  return script;
}

/** Plugin loader */
function loadPlugins(plugins) {
  if (_.isArray(plugins) && !_.isEmpty(plugins)) {
    _.forEach(plugins, function (p, i) {
      if (!_.isUndefined(p)) {
        document.body.appendChild(createScript(p, 'plugin' + i));
      }
    });
  }
}

/**
* Maploader module.
* @module maploader
* @see module:@djforth/gmaps_helper
* Loads googlemap API & and plugin code async
*
* type {function}
* @param {string} Path to Google Map API with Query Strings
* @return {object} of functions to build path
*/
module.exports = function (path) {
  var plugins = [];
  var obj = {
    /** Add plugins */
    addPlugins: function addPlugins(p) {
      if (_.isArray(p)) {
        plugins = plugins.concat(p);
      } else if (_.isString(p)) {
        plugins.push(p);
      }

      return obj;
    }
    /** load google api */
    , load: function load() {
      document.body.appendChild(createScript(path, 'gmapsScripts'));
      loadPlugins(plugins);
    }
  };

  return obj;
  // For Ref - document.body.appendChild(createScript(`http://maps.google.com/maps/api/js?v=3.&key=AIzaSyC6BXa6juoBqO_aUO9pFlNMVD3wroMdTrc&libraries=geometry&async=2&region=uk&callback=${cb_str}`);
};