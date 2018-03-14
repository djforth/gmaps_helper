import LoadedCallback from 'loaded_callback';

describe('LoadedCallback', () => {
  let callback, cb, m, map, options;

  const opts = {
    autozoom: true,
    boundmap: [1, 2, 3, 4],
  };

  beforeAll(() => {
    callback = jest.fn();
    m = {
      centerMap: jest.fn(),
      setZoom: jest.fn(),
      getMap: jest.fn(() => 'map'),
    };
    map = jest.fn(() => m);
    options = {
      addCenter: jest.fn(),
      addType: jest.fn(),
      get: jest.fn(key => opts[key]),
    };
  });

  describe('if no boundmap, autozoom or callback', () => {
    let get;
    beforeAll(() => {
      get = jest.fn();
      cb = LoadedCallback({ map, options: { ...options, get } });
      cb();
    });

    test('should return a function', () => {
      expect(cb).toBeFunction();
    });

    test('should call options function', () => {
      expect(options.addCenter).toHaveBeenCalled();
      expect(options.addType).toHaveBeenCalled();
      expect(get).toHaveBeenCalledTimes(2);
    });

    test('should call map functions', () => {
      expect(m.centerMap).not.toHaveBeenCalled();
      expect(m.setZoom).not.toHaveBeenCalled();
      expect(m.getMap).toHaveBeenCalled();
    });
  });

  describe('If map array', () => {
    beforeAll(() => {
      cb = LoadedCallback({ map, options });
      cb(callback);
    });

    afterAll(() => {
      Object.values(options).forEach(v => {
        v.mockClear();
      });

      Object.values(m).forEach(v => {
        v.mockClear();
      });
    });

    test('should return a function', () => {
      expect(cb).toBeFunction();
    });

    test('should call options function', () => {
      expect(options.addCenter).toHaveBeenCalled();
      expect(options.addType).toHaveBeenCalled();
      expect(options.get).toHaveBeenCalledTimes(2);
    });

    test('should call map functions', () => {
      // expect(m.centerMap).toHaveBeenCalledWith(google.maps.LatLngBounds);

      expect(m.setZoom).toHaveBeenCalledWith(google.maps.event);
      expect(m.getMap).toHaveBeenCalled();
    });

    test('should call cb', () => {
      expect(callback).toHaveBeenCalledWith(['map']);
    });
  });

  describe('If bounds, autozoom, and callback + 2 maps', () => {
    let map2, options2;
    beforeAll(() => {
      map2 = jest.fn(() => m);
      options2 = {
        addCenter: jest.fn(),
        addType: jest.fn(),
        get: jest.fn(key => opts[key]),
      };
      cb = LoadedCallback([{ map, options }, { map: map2, options: options2 }]);
      cb(callback);
    });

    test('should return a function', () => {
      expect(cb).toBeFunction();
    });

    test('should call options function', () => {
      expect(options.addCenter).toHaveBeenCalled();
      expect(options.addType).toHaveBeenCalled();
      expect(options.get).toHaveBeenCalledTimes(2);
    });

    test('should call options2 function', () => {
      expect(options2.addCenter).toHaveBeenCalled();
      expect(options2.addType).toHaveBeenCalled();
      expect(options2.get).toHaveBeenCalledTimes(2);
    });

    test('should call map functions', () => {
      expect(m.setZoom).toHaveBeenCalledTimes(2);
      expect(m.getMap).toHaveBeenCalledTimes(2);
    });

    test('should call cb', () => {
      expect(callback).toHaveBeenCalledWith(['map', 'map']);
    });
  });
});
