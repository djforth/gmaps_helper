
module.exports = function dummyMarker(i){
  return {
    marker: jasmine.createSpy(`marker${i}`)
    , info: {
      close: jasmine.createSpy(`marker_close${i}`)
    }
  };
};
