
async function getCollisionData(addToUrl) {
  const collisionData = []
  await fetch(`http://localhost:8080/${addToUrl}`)
    .then(blob => blob.json())
    .then(data => collisionData.push(...data));
  console.log('collisionData', collisionData);
  return collisionData;
}

async function getEvent(eventId, updateMapData) {
  const data = await getCollisionData(`events/${eventId}`);
  updateMapData(data);
}

async function getEventsByYearAndState(year, state, updateMapData) {
  const data = await getCollisionData(`events/year/${year}/state${state}`);
  const seriesData = data.map(d => ({
    lat: d.latitude,
    lon: d.longitude,
    localCity: d.localCity,
    localState: d.localState,
    z: d.eventCount,
    year: d.eventYear
  }));
  updateMapData(seriesData);
}

async function getEventCountsByYear(year, updateMapData) {
  const data = await getCollisionData(`eventCounts/year/${year}`);
  const aggregatedData = data.reduce((acc, curr) => {
    if (!acc[curr.localState]) {
      acc[curr.localState] = {
        localState: curr.localState,
        drilldown: `us-${curr.localState.toLowerCase()}`,
        value: 0,
        year: curr.eventYear
      }
    }
    acc[curr.localState].value += curr.eventCount;
    return acc;
  }, {});
  const seriesData = Object.values(aggregatedData);
  console.log('seriesData', seriesData);
  updateMapData(seriesData);
}

async function getEventCountsByYearAndState(year, state) {
  const data = await getCollisionData(`eventCounts/year/${year}/state/${state}`);
  const seriesData = data.map(d => ({
    lat: d.latitude,
    lon: d.longitude,
    localCity: d.localCity,
    localState: d.localState,
    value: d.eventCount,
    year: d.eventYear
  }));
  console.log('seriesData', seriesData);
  return seriesData;
}

export default {
  getEvent,
  getEventsByYearAndState,
  getEventCountsByYear,
  getEventCountsByYearAndState
};
