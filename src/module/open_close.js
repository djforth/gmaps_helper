/* global google InfoBubble */
function addClose(map, id) {
  return function(marker, infowindow) {
    let elem = document.getElementById(`pin-${id}`);
    /* istanbul ignore if  */
    if (elem === null) return null;

    google.maps.event.addDomListener(elem, 'click', function(e) {
      e.preventDefault();
      infowindow.close(map, marker);
    });
  };
}

export default (map, id, closer) => {
  let close = addClose(map, id);

  return (marker, infowindow) => {
    // console.log('infowindow >>>>', infowindow);
    google.maps.event.addListener(marker, 'click', () => {
      closer.closeAllWindows();
      infowindow.open(map, marker);
      /* istanbul ignore else  */
      if (typeof InfoBubble !== 'undefined') {
        google.maps.event.trigger(map, 'resize');
        setTimeout(() => {
          close(marker, infowindow);
        }, 500);
      }
    });
  };
};
