import React, { Component } from 'react';
import getCollisionData from '../getCollisionData';
import CircularProgress from 'material-ui/CircularProgress';
import mapData from '../third-party/us-all'
// see if I get npm version working, come back to...
const Highcharts = require('../third-party/highmaps');
Highcharts.maps['countries/us/us-all'] = mapData;

class NmacMap extends Component {
  componentDidMount() {
    const eventByType = 'year';
    const restParam = 2016;
    getCollisionData(eventByType, restParam, this.props.updateMapData);
  }
  componentDidUpdate() {
    renderMap(this.props.mapData);
  }
  render() {
    if (this.props.mapData) {
      return (
        <div id="nmacMap">

        </div>
      )
    }
    return <div style={{height: (window.innerHeight - 30), textAlign: 'center'}}>
      <CircularProgress size={300} thickness={7} style={{marginTop: '18em'}}/>
    </div>
  }
}

function renderMap(collisionMapData) {
  Highcharts.mapChart('nmacMap', {
    chart: {
      borderWidth: 0,
      backgroundColor: '',
      map: 'countries/us/us-all',
      height: '700px'
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
        name: 'NMACs by State',
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