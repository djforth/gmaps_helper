import _ from 'lodash';
import Maploader from 'maploader';

// import checkCalls from '@djforth/morse-jasmine-wp/check_calls';
// import {createHolder as createEl} from '@djforth/morse-jasmine-wp/create_elements';
// import {removeElement as removeEl} from '@djforth/morse-jasmine-wp/create_elements';
// import Stubs from '@djforth/morse-jasmine-wp/stub_inner';
// const stubs = Stubs(Maploader);

describe('maploader', () => {
  let src;
  beforeAll(() => {
    src = Maploader('gmaps/path');
  });

  test('returns object', () => {
    expect(src).hasKey('addPlugins');
    expect(src).hasKey('load');
  });

  describe('Add Plugins', () => {
    beforeAll(() => {
      src = Maploader('gmaps/path');
      src.addPlugins('plugin1');
      src.addPlugins(['plugin2', 'plugin3']);
      src.load();
    });

    test('should create gmapsScripts', () => {
      const gmap = document.getElementById('gmapsScripts');
      expect(gmap).toBeElement();
      expect(gmap).toHaveAttribute('type', 'text/javascript');
      expect(gmap).toHaveAttribute('src', 'gmaps/path');
    });

    ['plugin1', 'plugin2', 'plugin3'].forEach((plugin, i) => {
      test(`should create ${plugin}`, () => {
        const pluginEl = document.getElementById(`plugin${i}`);
        expect(pluginEl).toBeElement();
        expect(pluginEl).toHaveAttribute('type', 'text/javascript');
        expect(pluginEl).toHaveAttribute('src', plugin);
      });
    });
  });
});
