## @djforth/gmaps_helper

# Google Maps Helper

A small utility that helps build google maps. Vanilla JS with lodash/core dependency.

## Install

```bash
yarn add @djforth/gmaps_helper
```

```bash
npm install --save @djforth/gmaps_helper
```

Setting up HTML

```html
<div id='google-map-id' data-map='{\'pins\':{\'id\':1,\'lat\':50.722273,\'lng\':-1.873244,\'infowindow\':\'<div class='details'><h3>My Info Window</h3><p>My Address, Some Town. Postcode</p></div>\'}}'> </div>
```

The data map object can also pass config data or pins as an array.

Basic set up is

```javascipt
  import Maps from '@djforth/gmaps_helper';
  var map = Maps('[gmaps key goes here]')
            .load()
```

The constructor is passed id of the div you wish to apply the map. Also the google map key, go here to set one up - https://console.developers.google.com/flows/enableapi?apiid=maps_backend&keyType=CLIENT_SIDE&reusekey=true

You can also update the googlemaps config like so (see https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions)

```javascript
const map = Maps("[gmaps key goes here]")
  .addConfig("google-map-id", configObj)
  .setBounds()
  .setZoom(10)
  .load();
```

Add center (id of map, latitude, longitude)

```javascript
const map = Maps("[gmaps key goes here]")
  .addCenter("google-map-id", 50.722273, -1.873244)
  .load();
```

Add Map type (https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapTypeId)

```javascript
const map = Maps("[gmaps key goes here]")
  .addType("google-map-id", "HYBRID")
  .load();
```

Add Plugins (https://developers.google.com/maps/documentation/javascript/libraries)

```javascript
var map = Maps("[gmaps key goes here]")
  .addLibraries("google-map-id", "geometry")
  .load();
```

Add callback returns google map object:

```javascript
var map = Maps("[gmaps key goes here]").addCallback(function(
  maps /* Array of maps [{map, options}]*/
) {
  // do something with maps...
});
```

# Bug reports

If you discover any bugs, feel free to create an issue on GitHub. Please add as much information as possible to help us fixing the possible bug. We also encourage you to help even more by forking and sending us a pull request.

https://github.com/djforth/gmaps_helper/issues

## Contribute

If you'd like to contribute, gmaps_helper is written using babel in ES6.

Please make sure any additional code should be covered in tests (Jasmine using karma).

If you need to run the test please use:

```bash

npm test

```

or to rebuild the JS run:

```bash

npm run build

```

## Maintainers

Adrian Stainforth (https://github.com/djforth)

# License

gmaps_helper is an open source project falling under the MIT License. By using, distributing, or contributing to this project, you accept and agree that all code within the gmaps_helper project are licensed under MIT license.

foo
