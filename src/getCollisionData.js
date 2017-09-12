import properCase from 'proper-case';

async function getCollisionData(addToUrl) {
  const collisionData = []
  await fetch(`http://localhost:8080/${addToUrl}`)
    .then(blob => blob.json())
    .then(data => collisionData.push(...data));
  return collisionData;
}

async function getEvent(eventId, updateCollisionData) {
  const data = await getCollisionData(`events/${eventId}`);
  updateCollisionData(data);
}

async function getEventsByYearAndState(year, state, updateCollisionData) {
  const data = await getCollisionData(`events/year/${year}/state${state}`);
  const seriesData = data.map(d => ({
    lat: d.latitude,
    lon: d.longitude,
    localCity: d.localCity,
    localState: d.localState,
    z: d.eventCount,
    year: d.eventYear
  }));
  updateCollisionData(seriesData);
}

async function getEventCountsByYear(year, updateCollisionData) {
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
  updateCollisionData(seriesData);
}

async function getEventCountsByYearAndState(year, state, updateCollisionData) {
  const data = await getCollisionData(`eventCounts/year/${year}/state/${state}`);
  const seriesData = data.map(d => ({
    lat: d.latitude,
    lon: d.longitude,
    localCity: properCase(d.localCity),
    localState: d.localState,
    z: d.eventCount,
    year: d.eventYear
  }));
  updateCollisionData(seriesData);
}

export default {
  getEvent,
  getEventsByYearAndState,
  getEventCountsByYear,
  getEventCountsByYearAndState
};
