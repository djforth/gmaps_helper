/* global InfoBubble google */
function createInfoBubble(maps, content, opts) {
  let options = {
    shadowStyle: 0,
    padding: 0,
    backgroundColor: '#55a440',
    borderRadius: 0,
    arrowSize: 2,
    borderWidth: 0,
    borderColor: '#2c2c2c',
    disableAutoPan: false,
    hideCloseButton: true,
    arrowPosition: 50,
    minHeight: 220,
    backgroundClassName: 'infowindow clearfix',
    arrowStyle: 2,
    maps,
    content,
    ...opts,
  };

  // options.maps = map;
  // options.content = info;

  return new InfoBubble(options);
}

export default (map, info, opts) => {
  if (typeof InfoBubble !== 'undefined') {
    return createInfoBubble(map, info, opts);
  }

  return new google.maps.InfoWindow({ content: info });
};
