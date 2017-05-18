import _ from 'lodash';
import openClose from 'src/open_close';

import mockGmaps from './helpers/stub_gmaps';
import Stubs from '@djforth/morse-jasmine-wp/stub_inner';
const stubs = Stubs(openClose);
import Spymanager from '@djforth/morse-jasmine-wp/spy_manager';
const spymanager = Spymanager();
import checkCalls from '@djforth/morse-jasmine-wp/check_calls';

describe('openClose', function(){
  let oc;
  beforeEach(function(){
    spy = jasmine.createSpyObj("marker", ["setIcon"])
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
