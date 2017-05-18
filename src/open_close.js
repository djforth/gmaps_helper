import _ from 'lodash';
/* global google InfoBubble */
function addClose(map, id){
  return function(marker, infowindow){

    let elem = document.getElementById(`pin-${id}`);
    if (_.isNull(elem)) return null;

    google.maps.event.addDomListener(
      elem
      , 'click'
      , function(e){
        e.preventDefault();
        infowindow.close(map, marker);
      }
    );
  };
}

export default (map, id, closer)=>{
  let close = addClose(map, id);

  return function(marker, infowindow){
    console.log('infowindow >>>>', infowindow)
    google.maps.event.addListener(
      marker
      , 'click'
      , ()=>{
        console.log('infowindow', infowindow)
        closer.closeAllWindows();
        infowindow.open(map, marker);

        if (typeof InfoBubble !== 'undefined'){
          google.maps.event.trigger(map, 'resize');
          _.delay(()=>{
            close(marker, infowindow);
          }, 500);
        }
      }
    );
  };
};
