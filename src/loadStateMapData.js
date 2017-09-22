import load from '@segment/load-script';

const Highcharts = require('highcharts/highmaps');

function getMapKey(country, state) {
  const localState = state.toLowerCase();
  const localCountry = country.toLowerCase();
  const mapKey = country === 'US' ? `countries/us/us-${localState}-all`
    : `countries/${localCountry}/${localCountry}-all`;
  return mapKey;
}

function loadStateMapData(country, state, callback) {
  const response = {
    isLoaded: false,
    error: null,
  };
  const mapKey = getMapKey(country, state);
  if (!Highcharts.maps[mapKey]) {
    const srcUrl = `https://code.highcharts.com/mapdata/${mapKey}.js`;
    load(srcUrl, (err) => {
      if (err) {
        response.error = err;
        callback(response);
      }
      response.isLoaded = !!Highcharts.maps[mapKey];
      callback(response);
    });
  } else {
    response.isLoaded = true;
    callback(response);
  }
}

export default {
  loadStateMapData,
  getMapKey,
};
