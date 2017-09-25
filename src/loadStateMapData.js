import loadScript from 'simple-load-script';

function getMapKey(country, state) {
  const localState = state.toLowerCase();
  const localCountry = country.toLowerCase();
  const mapKey = country.toUpperCase() === 'US' ? `countries/us/us-${localState}-all`
    : `countries/${localCountry}/${localCountry}-all`;
  return mapKey;
}

function loadStateMapData(Highcharts, country, state, callback) {
  const mapKey = getMapKey(country, state);
  if (!Highcharts.maps[mapKey]) {
    const srcUrl = `https://code.highcharts.com/mapdata/${mapKey}.js`;
    loadScript(srcUrl).then(() => {
      callback({ isLoaded: !!Highcharts.maps[mapKey] });
    }).catch((error) => {
      console.log('error', error);
      callback({ error });
    });
  } else {
    callback({ isLoaded: true });
  }
}

export default {
  loadStateMapData,
  getMapKey,
};
