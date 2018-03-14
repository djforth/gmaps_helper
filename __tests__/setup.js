const InfoWindow = jest.fn(() => 'info');
const LatLng = jest.fn(() => 'LatLng');
const setIcon = jest.fn();
const extend = jest.fn();

global.InfoWindow = InfoWindow;
global.LatLng = LatLng;
global.setIcon = setIcon;
global.extend = extend;

global.google = {
  maps: {
    event: {
      addDomListener: jest.fn(),
      addListener: jest.fn(),
      trigger: jest.fn(),
    },
    InfoWindow: jest.fn().mockImplementation(() => InfoWindow),
    LatLng: jest.fn().mockImplementation(() => LatLng),
    LatLngBounds: jest.fn().mockImplementation(() => ({ extend })),
    Marker: jest.fn().mockImplementation(() => ({ setIcon })),
    Map: jest.fn().mockImplementation(),
    MapTypeId: {},
  },
};

const Bubble = jest.fn(() => 'info bubble');
global.Bubble = Bubble;
global.InfoBubble = jest.fn().mockImplementation(() => Bubble);
