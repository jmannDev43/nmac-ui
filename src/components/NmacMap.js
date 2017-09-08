import React, { Component } from 'react';

import mapData from '../third-party/us-all'
// see if I get npm version working, come back to...
const Highcharts = require('../third-party/highmaps');
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
  Highcharts.mapChart('nmacMap', {
    chart: {
      borderWidth: 0,
      backgroundColor: '',
      map: 'countries/us/us-all'
    },
    title: {
      text: ''
    },
    legend: {
      enabled: false
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    series: [
      {
        name: 'States',
        color: '#E0E0E0',
        enableMouseTracking: false
      },
      {
        type: 'mapbubble',
        name: 'NMACs by Location',
        dataLabels: {
          enabled: true,
          format: '{point.z}'
        },
        tooltip: {
          pointFormat: '{point.localCity}, {point.localState} <br> {point.lat}, {point.lon}, <br> {point.z} collisions'
        },
        data: collisionMapData,
        minSize: 6,
        maxSize: '15%'
      }
    ]
  });
}

export default NmacMap;