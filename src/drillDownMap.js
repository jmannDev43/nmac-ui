// import rp from 'request-promise-native';
import load from '@segment/load-script';
import properCase from 'proper-case';
import getMethods from './getCollisionData';
const Highcharts = require('highcharts/highmaps');

// let txData = [{"id":5023,"eventYear":2016,"localCity":"ADDISON","localState":"TX","latitude":32.96179,"longitude":-96.82917,"eventCount":1},{"id":5024,"eventYear":2016,"localCity":"AUSTIN","localState":"TX","latitude":30.267153,"longitude":-97.74306,"eventCount":2},{"id":5025,"eventYear":2016,"localCity":"BOERNE","localState":"TX","latitude":29.794664,"longitude":-98.73197,"eventCount":1},{"id":5026,"eventYear":2016,"localCity":"CLEBURNE","localState":"TX","latitude":32.347645,"longitude":-97.38668,"eventCount":1},{"id":5027,"eventYear":2016,"localCity":"COLLEGE STATION","localState":"TX","latitude":30.627977,"longitude":-96.334404,"eventCount":1},{"id":5028,"eventYear":2016,"localCity":"FORT WORTH","localState":"TX","latitude":32.72541,"longitude":-97.32085,"eventCount":1},{"id":5029,"eventYear":2016,"localCity":"HOUSTON","localState":"TX","latitude":29.763283,"longitude":-95.36327,"eventCount":22},{"id":5030,"eventYear":2016,"localCity":"LAREDO","localState":"TX","latitude":27.506407,"longitude":-99.507545,"eventCount":1},{"id":5031,"eventYear":2016,"localCity":"LUCAS","localState":"TX","latitude":33.084286,"longitude":-96.57666,"eventCount":1},{"id":5032,"eventYear":2016,"localCity":"ROBSTOWN","localState":"TX","latitude":27.790302,"longitude":-97.668884,"eventCount":1},{"id":5033,"eventYear":2016,"localCity":"SAN ANTONIO","localState":"TX","latitude":29.424122,"longitude":-98.49363,"eventCount":3},{"id":5034,"eventYear":2016,"localCity":"SHERMAN","localState":"TX","latitude":33.635662,"longitude":-96.60888,"eventCount":1},{"id":5035,"eventYear":2016,"localCity":"TERRELL","localState":"TX","latitude":32.735962,"longitude":-96.27525,"eventCount":1},{"id":5036,"eventYear":2016,"localCity":"TOMBALL","localState":"TX","latitude":30.097162,"longitude":-95.61606,"eventCount":4},{"id":5037,"eventYear":2016,"localCity":"WAXAHACHIE","localState":"TX","latitude":32.38653,"longitude":-96.84833,"eventCount":1}];


async function drillDownMap(e) {

  if (!e.seriesOptions) {
    const chart = this;
    const mapKey = 'countries/us/' + e.point.drilldown + '-all';
    // Handle error, the timeout is cleared on success
    let fail = setTimeout(function () {
      if (!Highcharts.maps[mapKey]) {
        chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);

        fail = setTimeout(function () {
          chart.hideLoading();
        }, 1000);
      }
    }, 3000);

    // Show the spinner
    chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

    // Load the drilldown map
    const srcUrl = 'https://code.highcharts.com/mapdata/' + mapKey + '.js'
    window.Highcharts = Highcharts;
    load(srcUrl, async () => {
      console.log('Highcharts.maps', Highcharts.maps);
        console.log('Highcharts', Highcharts.maps[mapKey]);
        let mapData = Highcharts.geojson(Highcharts.maps[mapKey])
        mapData = mapData.filter(m => !m['hc-key']);
        console.log('data', mapData);

        // Hide loading and add series
        chart.hideLoading();
        clearTimeout(fail);
        let drillDownData = await getMethods.getEventCountsByYearAndState(2016, 'CA');
        drillDownData = drillDownData.map(d => ({
            lat: d.latitude,
            lon: d.longitude,
            value: d.eventCount,
            city: properCase(d.localCity)
          }));
        console.log('myData', drillDownData);
        chart.addSeriesAsDrilldown(e.point, {
          // type: 'mapbubble',
          name: e.point.name,
          mapData,
          data: drillDownData,
          joinBy: ['name', 'city'],
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          },
          tooltip: {
            format: '{point.city} - {point.value} collisions'
          }
        });
      });

    this.setTitle(null, {text: e.point.name});
  }
}

// https://stackoverflow.com/questions/16839698/jquery-getscript-alternative-in-native-javascript
// async function nativeGetScript(srcUrl) {
//
//   const scriptTag = document.createElement('script'); // create a script tag
//   const firstScriptTag = document.getElementsByTagName('script')[0]; // find the first script tag in the document
//   await (() => {
//     scriptTag.src = srcUrl; // set the source of the script to your script
//     firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag); // append the script to the DOM
//   })();
// }

export default drillDownMap;
