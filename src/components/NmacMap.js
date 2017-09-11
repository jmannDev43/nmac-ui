import React, { Component } from 'react';
import drillDownMap from '../drillDownMap';
import mapData from '../third-party/us-all'
const Highcharts = require('highcharts/highmaps')
require('highcharts/modules/drilldown')(Highcharts);
Highcharts.maps['countries/us/us-all'] = mapData;

class NmacMap extends Component {
  componentDidMount() {
    console.log(`Mount Map`);
    renderMap(this.props.mapData);
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(`Update Map`);
    if (prevProps.mapData && this.props.mapData &&
      prevProps.mapData[0].year !== this.props.mapData[0].year) {
      renderMap(this.props.mapData);
    }
  }
  render() {
      return (
        <div id="nmacMap">

        </div>
      )
  }
}

function renderMap(collisionMapData) {
  const max = Math.max.apply(null, collisionMapData.map((d) => d.value));
  Highcharts.mapChart('nmacMap', {
    chart: {
      borderWidth: 0,
      backgroundColor: '',
      map: 'countries/us/us-all',
      // height: '600px',
      events: {
        drilldown: drillDownMap,
        drillup: function () {
          this.setTitle(null, { text: 'USA' });
        }
      }
    },
    title: {
      text: ''
    },
    legend: {
      enabled: true
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    colorAxis: {
      min: 1,
      max,
      type: 'logarithmic'
    },
    plotOptions: {
      // series: {
      //   events: {
      //     click: function (e) {
      //       console.log('this', this);
      //       drillDownMap(e, this.chart);
      //     }
      //   }
      // },
      map: {
        states: {
          hover: {
            color: '#ff4852'
          }
        }
      }
    },
    series: [
      // {
      //   name: 'States',
      //   mapData,
      //   color: '#E0E0E0'
      // },
      {
        // type: 'mapbubble',
        name: 'NMACs by Location',
        states: {
          hover: {
            color: '#ffc444'
          }
        },
        dataLabels: {
          enabled: true,
          format: '{point.localState} - {point.value}'
          // format: '{point.localState} - {point.z}'
        },
        tooltip: {
          // pointFormat: '{point.localCity}, {point.localState} <br> {point.lat}, {point.lon}, <br> {point.z} collisions'
          pointFormat: '{point.localState}, {point.value} collisions'
        },
        data: collisionMapData,
        mapData,
        joinBy: ['hc-a2', 'localState']
      }
    ],
    drilldown: {
      activeDataLabelStyle: {
        color: '#FFFFFF',
        textDecoration: 'none',
        textOutline: '1px #000000'
      },
      drillUpButton: {
        relativeTo: 'spacingBox',
        position: {
          x: 0,
          y: 60
        }
      }
    }
  });
}

export default NmacMap;