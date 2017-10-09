import properCase from 'proper-case';

function getHascCode(state, country) {
  return state === 'PR' ? 'PR.' : `${country}.${state}`;
}

async function getEventData(addToUrl) {
  const response = await fetch(`http://${window.location.hostname}:5000/${addToUrl}`);
  const data = await response.json();
  return data;
}

async function getEventsByYearStateCity(year, state, city) {
  const rawData = await getEventData(`events/year/${year}/state/${state}/city/${city}`);
  return rawData;
}

async function getEventCountsByYear(year) {
  const data = await getEventData(`eventCounts/year/${year}`);
  const aggregatedData = data.reduce((acc, curr) => {
    if (!acc[curr.localState]) {
      acc[curr.localState] = {
        localCountry: curr.localCountry,
        localState: curr.localState,
        hascCode: getHascCode(curr.localState, curr.localCountry),
        value: 0,
        year: curr.eventYear,
      };
    }
    acc[curr.localState].value += curr.eventCount;
    return acc;
  }, {});
  const seriesData = Object.values(aggregatedData);
  return seriesData;
}

async function getEventCountsByYearCountryAndState(year, country, state) {
  const data = await getEventData(`eventCounts/year/${year}/country/${country}/state/${state}`);
  const seriesData = data.map(d => ({
    lat: d.latitude,
    lon: d.longitude,
    localCity: properCase(d.localCity),
    localState: d.localState,
    localCountry: d.localCountry,
    hascCode: getHascCode(d.localState, d.localCountry),
    z: d.eventCount,
    year: d.eventYear,
  }));
  return seriesData;
}

export default {
  getHascCode,
  getEventsByYearStateCity,
  getEventCountsByYear,
  getEventCountsByYearCountryAndState,
};
