import rp from 'request-promise-native';

async function getCollisionData(eventByType, restParam, updateMapData) {
  const json = await rp(`http://localhost:8080/events/${eventByType}/${restParam}`);
  const rawData = JSON.parse(json);
  const aggregatedData = rawData.reduce((acc, curr) => {
    if (!acc[`${curr.latitude}_${curr.longitude}`]) {
      acc[`${curr.latitude}_${curr.longitude}`] = {
        lat: curr.latitude,
        lon: curr.longitude,
        localCity: curr.localCity,
        localState: curr.localState,
        z: 0
      }
    }
    acc[`${curr.latitude}_${curr.longitude}`].z += 1;
    return acc;
  }, {});
  const aggregatedSeriesData = Object.values(aggregatedData);
  updateMapData(aggregatedSeriesData);
}

export default getCollisionData;
