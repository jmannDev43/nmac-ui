import load from '@segment/load-script';
import properCase from 'proper-case';
import getMethods from './getCollisionData';

const Highcharts = require('highcharts/highmaps');

let originalSeries;

async function drillDownMap(e, chart) {
  if (!e.seriesOptions) {
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
    chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

    const srcUrl = 'https://code.highcharts.com/mapdata/' + mapKey + '.js'
    window.Highcharts = Highcharts;
    load(srcUrl, async () => {
      let mapData = Highcharts.geojson(Highcharts.maps[mapKey])
      mapData = mapData.filter(m => !m['hc-key']);

      // Hide loading and add series
      chart.hideLoading();
      clearTimeout(fail);
      let drillDownData = await getMethods.getEventCountsByYearAndState(e.point.year, e.point.localState);

      originalSeries = chart.series[0];
      chart.series[0].remove();
      chart.map = mapKey;
      chart.addSeries({
        name: 'Countries',
        color: '#E0E0E0',
        enableMouseTracking: false,
        mapData
      });
      chart.addSeries({
        type: 'mapbubble',
        name: e.point.name,
        data: drillDownData,
        minSize: 4,
        maxSize: '12%',
        dataLabels: {
          enabled: true,
          format: '{point.localCity} - {point.z} collisions'
        },
        tooltip: {
          format: '{point.localCity} - {point.z} collisions'
        }
      });
      chart.redraw();
      addDrillUpButton(chart);
    });

    chart.setTitle(null, {text: e.point.name});
  }
}

export default drillDownMap;
