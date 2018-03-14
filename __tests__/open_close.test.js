import openClose from 'open_close';
jest.useFakeTimers();

describe('openClose', function() {
  let closer, marker, map, infowindow, oc, pin;
  beforeAll(function() {
    document.body.innerHTML = "<div id='pin-1'></div>";
    closer = {
      closeAllWindows: jest.fn(),
    };
    map = jest.fn();
    marker = jest.fn();
    infowindow = {
      close: jest.fn(),
      open: jest.fn(),
    };
    pin = document.getElementById('pin-1');
    oc = openClose(map, 1, closer);
  });

  test('should return function', () => {
    expect(oc).toBeFunction();
  });

  describe('If function is called', () => {
    beforeAll(() => {
      oc(marker, infowindow);
    });

    test('should call  google.maps.event.addListener', () => {
      expect(google.maps.event.addListener).toHaveBeenCalledWith(marker, 'click', expect.any(Function));
    });

    describe('If click called with info bubble', () => {
      beforeAll(() => {
        let callback = google.maps.event.addListener.mock.calls[0][2];
        callback();
      });

      test('should call closer.closeAllWindows', () => {
        expect(closer.closeAllWindows).toHaveBeenCalled();
      });

      test('should call google.maps.event.trigger', () => {
        expect(google.maps.event.trigger).toHaveBeenCalledWith(map, 'resize');
      });

      test('should call infowindow.open', () => {
        expect(infowindow.open).toHaveBeenCalledWith(map, marker);
      });

      test('should call close', () => {
        jest.runAllTimers();
        expect(google.maps.event.addDomListener).toHaveBeenCalledWith(pin, 'click', expect.any(Function));
      });

      describe('test close', () => {
        let callback, e;
        beforeAll(() => {
          e = {
            preventDefault: jest.fn(),
          };
          jest.runAllTimers();
          callback = google.maps.event.addDomListener.mock.calls[0][2];
        });

        test('should call close', () => {
          expect(google.maps.event.addDomListener).toHaveBeenCalledWith(pin, 'click', expect.any(Function));
        });

        test('domListener callback', () => {
          callback(e);
          expect(e.preventDefault).toHaveBeenCalled();

          expect(infowindow.close).toHaveBeenCalledWith(map, marker);
        });
      });
    });
  });
});
