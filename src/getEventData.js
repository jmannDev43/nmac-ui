import properCase from 'proper-case';

async function getEventData(addToUrl) {
  const response = await fetch(`http://localhost:8080/${addToUrl}`)
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
        localState: curr.localState,
        drilldown: `us-${curr.localState.toLowerCase()}`,
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

async function getEventCountsByYearAndState(year, state) {
  const data = await getEventData(`eventCounts/year/${year}/state/${state}`);
  const seriesData = data.map(d => ({
    lat: d.latitude,
    lon: d.longitude,
    localCity: properCase(d.localCity),
    localState: d.localState,
    z: d.eventCount,
    year: d.eventYear,
  }));
  return seriesData;
}

export default {
  getEventsByYearStateCity,
  getEventCountsByYear,
  getEventCountsByYearAndState,
};
