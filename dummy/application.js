import Maps from '../src/map';

// Maps
let map = Maps('google-map', 'AIzaSyCd_ADDeFilcDAcvUxUA9lqVwSfvchLOuk')
map.setBounds();
map.setZoom(10);
map.load();
