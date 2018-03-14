import isElement from 'lodash/isElement';
import isFunction from 'lodash/isFunction';
import partial from 'lodash/partial';

/** Add loader class */
function addLoader(el){
  el.className += ' loader';
}

/** Remove loader class */
function removeLoader(el){
  el.className = el.className.replace(' loader', '');
}

/**
* Lazyload module.
* @module create_gmaps_path
* @see module:@djforth/gmaps_helper
* Creates lazyloader for gmaps - apply's an event to the surrounding div the can be triggered
*
* type {function}
* @param {element} dom element you wish to bind event too
* @param {string} Event you wish it triggered on
* @param {function} Callback
* @return {object} of functions to build path
*/

export default (el, event, callback)=>{
  if (!el) return;

  var loader = partial(removeLoader, el);
  function eventAction(e){
    e.preventDefault();
    addLoader(el);
    if (typeof callback === 'function')){
      callback(loader);
    }
    el.removeEventListener(event, eventAction, false);
  }
  el.addEventListener(event, eventAction, false);
};
