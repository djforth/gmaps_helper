const _         = require('lodash');
const openClose = require('../src/open_close');

var mockGmaps = require('./helpers/stub_gmaps')
  , stubs     = require('@djforth/morse-jasmine-wp/stub_inner')(openClose)
  , spymanager = require('@djforth/morse-jasmine-wp/spy_manager')()
  , checkCalls = require('@djforth/morse-jasmine-wp/check_calls');

describe('openClose', function(){
  let oc;
  beforeEach(function(){
    // spy = jasmine.createSpyObj("marker", ["setIcon"])
    window.google = mockGmaps(
      {event: {
        type: 'spyObj'
            , addListener: {type: 'noReturn'}
            , addDomListener: {type: 'noReturn'}
            , trigger: {type: 'noReturn'}
      }
      }
      );

    spymanager.addSpy([
      'map'
    , 'marker'
    , {title: 'closer', opts: ['closeAllWindows']}
    , {title: 'infowindow', opts: ['close', 'open']}
    ]);

    oc = openClose(spymanager.getSpy('map'), 1);
  });

  afterEach(function(){
    stubs.revertAll();
  });
});
