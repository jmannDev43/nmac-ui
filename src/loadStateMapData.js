import load from '@segment/load-script';

const Highcharts = require('highcharts/highmaps');

function loadStateMapData(state, callback) {
  const mapKey = `countries/us/us-${state.toLowerCase()}-all`;
  if (!Highcharts.maps[mapKey]) {
    const srcUrl = `https://code.highcharts.com/mapdata/${mapKey}.js`;
    load(srcUrl, (err) => {
      if (err) {
        callback(null, err);
      }
      callback(!!Highcharts.maps[mapKey]);
    });
  }
  callback(!!Highcharts.maps[mapKey]);
}

export default loadStateMapData;
