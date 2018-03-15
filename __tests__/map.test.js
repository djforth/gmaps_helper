import _ from 'lodash';
import { readFileSync } from 'fs';
import { join } from 'path';
import Gmap from 'index';

import createPath from 'create_gmaps_path';
import getOptions from 'options';
import LazyLoad from 'lazyload';
import mapCreator from 'create_map';
import LoadedCallback from 'loaded_callback';

jest.mock('create_gmaps_path', () =>
  jest.fn(key => ({
    getPath: jest.fn(() => key),
  }))
);

jest.mock('lazyload');
jest.mock('create_map');
jest.mock('loaded_callback', () => jest.fn(() => jest.fn(cb => cb())));

jest.mock('options', () =>
  jest.fn(() => ({
    addCenter: jest.fn(),
    addType: jest.fn(),
    get: key => {
      const opts = {
        autozoom: true,
        boundmap: [1, 2, 3, 4],
        libraries: 'my-library',
      };

      return opts[key];
    },
    update: jest.fn(),
  }))
);

const htmlPath = join(__dirname, '/../__markup__/maps.html');
const markup = readFileSync(htmlPath);

describe('map', () => {
  const opts = {
    autozoom: true,
    boundmap: [1, 2, 3, 4],
  };

  describe('Build Maps', () => {
    let maps;

    describe('If no elements', () => {
      beforeAll(() => {
        document.body.innerHTML = '';
        maps = Gmap('gmaps-key');
      });

      test('should return undefined', () => {
        expect(maps).toBeUndefined();
      });
    });

    describe('If elements', () => {
      let mapsArray;
      beforeAll(() => {
        document.body.innerHTML = markup.toString();
        maps = Gmap('gmaps-key');
        mapsArray = maps.getMaps();
      });

      test('Should return object', () => {
        const expected = [
          'addCallback',
          'addCenter',
          'addConfig',
          // 'addlazyload',
          'addLibraries',
          'addType',
          'load',
          'setBounds',
          'setZoom',
        ];
        expect(Object.keys(maps)).toEqual(expect.arrayContaining(expected));

        Object.values(maps).forEach(fn => {
          expect(fn).toBeFunction();
        });
      });

      test('should call createPath', () => {
        expect(createPath).toHaveBeenCalledWith('gmaps-key');
      });

      test('should call getOptions', () => {
        expect(getOptions).toHaveBeenCalledTimes(2);
        expect(getOptions).toHaveBeenCalledWith(expect.any(String));
      });

      test('should call mapCreator', () => {
        expect(mapCreator).toHaveBeenCalledTimes(2);
        expect(mapCreator).toHaveBeenCalledWith(expect.any(Element));
      });

      test('should call LoadedCallback', () => {
        expect(LoadedCallback).toHaveBeenCalledWith(expect.any(Array));
      });

      describe('Options', () => {
        test('should add callback', () => {
          const callback = jest.fn();
          maps.addCallback(callback);
          window.mapLoaded();
          expect(callback).toHaveBeenCalled();
        });

        test('should addCenter', () => {
          maps.addCenter('google-map', 10, 20);
          const { options } = mapsArray.find(({ id }) => id === 'google-map');

          expect(options.update).toHaveBeenCalledWith(
            expect.objectContaining({
              lat: 10,
              lng: 20,
              centermap: true,
            })
          );
        });

        test('should addConfig', () => {
          maps.addConfig('google-map', { config: 'some-config' });
          const { options } = mapsArray.find(({ id }) => id === 'google-map');

          expect(options.update).toHaveBeenCalledWith(expect.objectContaining({ config: 'some-config' }));
        });

        test('should addLibraries', () => {
          maps.addLibraries('google-map', 'my-library');
          const { options } = mapsArray.find(({ id }) => id === 'google-map');

          expect(options.update).toHaveBeenCalledWith(expect.objectContaining({ libraries: 'my-library' }));
        });

        test('should addType', () => {
          maps.addType('google-map', 'my-type');
          const { options } = mapsArray.find(({ id }) => id === 'google-map');

          expect(options.update).toHaveBeenCalledWith(expect.objectContaining({ type: 'my-type' }));
        });

        test('should setBounds', () => {
          maps.setBounds('google-map');
          const { options } = mapsArray.find(({ id }) => id === 'google-map');

          expect(options.update).toHaveBeenCalledWith(expect.objectContaining({ boundmap: true }));
        });

        test('should setZoom', () => {
          maps.setZoom('google-map', 15);
          const { options } = mapsArray.find(({ id }) => id === 'google-map');

          expect(options.update).toHaveBeenCalledWith(expect.objectContaining({ zoom: 15, autozoom: true }));
        });

        test('should load gmaps', () => {
          maps.load();
          const gmapsScript = document.getElementById('gmapsScripts');
          expect(gmapsScript).toBeElement();

          expect(document.getElementById('plugin0')).toBeElement();

          expect(document.getElementById('plugin1')).toBeElement();
        });
      });
    });
  });
});
