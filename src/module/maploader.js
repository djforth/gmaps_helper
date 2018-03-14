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
  if (Array.isArray(plugins) && plugins.length > 0) {
    plugins.forEach((p, i) => {
      if (p !== undefined) {
        document.body.appendChild(createScript(p, `plugin${i}`));
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
export default path => {
  let plugins = [];
  var obj = {
    /** Add plugins */
    addPlugins: p => {
      if (Array.isArray(p)) {
        plugins = plugins.concat(p);
      } else if (typeof p === 'string') {
        plugins.push(p);
      }

      return obj;
    },
    /** load google api */
    load: () => {
      if (!document.getElementById('gmapsScripts')) {
        document.body.appendChild(createScript(path, 'gmapsScripts'));
        loadPlugins(plugins);
      }
    },
  };

  return obj;
  // For Ref - document.body.appendChild(createScript(`http://maps.google.com/maps/api/js?v=3.&key=AIzaSyC6BXa6juoBqO_aUO9pFlNMVD3wroMdTrc&libraries=geometry&async=2&region=uk&callback=${cb_str}`);
};
