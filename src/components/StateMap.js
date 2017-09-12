import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import mapData from '../third-party/us-all'
import getMethods from '../getCollisionData';
import CircularProgress from 'material-ui/CircularProgress';
import YearStepper from './YearStepper';
import load from '@segment/load-script';
const Highcharts = require('highcharts/highmaps')
require('highcharts/modules/exporting')(Highcharts);
// import load from '@segment/load-script';
// import properCase from 'proper-case';

class StateMap extends Component {
  constructor() {
    super();
    this.state = {
      collisionData: null
    }
  }
  getMapData() {
    const activeYear = parseInt(this.props.match.params.year);
    const state = this.props.match.params.state;
    getMethods.getEventCountsByYearAndState(activeYear, state, this.updateCollisionData.bind(this));
  }
  componentDidMount() {
    this.getMapData();
  }
  updateCollisionData(collisionData) {
    this.setState({ collisionData });
    const state = this.props.match.params.state.toLowerCase();
    const mapKey = `countries/us/us-${state}-all`;
    // let fail = setTimeout(function () {
    //   if (!Highcharts.maps[mapKey]) {
    //     chart.showLoading(`<i class="icon-frown"></i> Failed loading ${state}`);
    //
    //     fail = setTimeout(function () {
    //       chart.hideLoading();
    //     }, 1000);
    //   }
    // }, 3000);
    // chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

    if (!window.Highcharts) {
      window.Highcharts = Highcharts;
    }

    if (Highcharts.maps[mapKey]) {
      let stateGeoData = Highcharts.geojson(Highcharts.maps[mapKey])
      stateGeoData = stateGeoData.filter(m => !m['hc-key']);
      renderMap(collisionData, stateGeoData, mapKey, this.props);
    } else {
      const srcUrl = `https://code.highcharts.com/mapdata/${mapKey}.js`
      load(srcUrl, () => {
        let stateGeoData = Highcharts.geojson(Highcharts.maps[mapKey])
        stateGeoData = stateGeoData.filter(m => !m['hc-key']);
        // chart.hideLoading();
        // clearTimeout(fail);
        renderMap(collisionData, stateGeoData, mapKey, this.props);
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(`Update Map`);
    if (prevProps.location !== this.props.location) {
      this.getMapData();
    }
  }
  render() {
    const activeYear = this.props.match.params.year;
    if (!this.state.collisionData) {
      return <div style={{height: (window.innerHeight - 30), textAlign: 'center'}}>
        <CircularProgress size={300} thickness={7} style={{marginTop: '18em'}}/>
      </div>
    }
    return (
      <div>
        <div id="stateMap"></div>
        <YearStepper
          activeYear={activeYear}
          url={this.props.match.url}
        />
      </div>
    )
  }
}

function renderMap(collisionData, stateGeoData, mapKey, props) {
  const max = Math.max.apply(null, collisionData.map((d) => d.value));
  Highcharts.mapChart('stateMap', {
    chart: {
      borderWidth: 0,
      backgroundColor: '',
      map: mapKey,
    },
    lang: {
      returnToUS: 'Return to US'
    },
    exporting: {
      buttons: [{
        text: 'Return to US',
        _titleKey: 'returnToUS',
        onclick: function () {
          const activeYear = props.match.params.year;
          props.history.push(`/events/US/${activeYear}`)
        },
        theme: {
          'stroke-width': 1,
          stroke: 'silver',
          r: 0,
          states: {
            hover: {
              fill: '#28ceff'
            },
            select: {
              stroke: '#039',
              fill: '#28ceff'
            }
          }
        }
      }]
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
    plotOptions: {
      map: {
        states: {
          hover: {
            color: '#ff4852'
          }
        }
      }
    },
    series: [
      {
        name: 'Cities',
        mapData: stateGeoData,
        color: '#E0E0E0'
      },
      {
        type: 'mapbubble',
        name: props.match.params.state,
        data: collisionData,
        minSize: 4,
        maxSize: '12%',
        dataLabels: {
          enabled: true,
          format: '{point.localCity} - {point.z} collisions'
        },
        tooltip: {
          format: '{point.localCity} - {point.z} collisions'
        }
      }
    ]
  });
}

// function addDrillUpButton(chart) {
//   const normalState = new Object();
//   normalState.stroke_width = null;
//   normalState.stroke = null;
//   normalState.fill = null;
//   normalState.padding = null;
//   normalState.r = null;
//   normalState.rx = null;
//
//   let pressedState = new Object();
//   pressedState = normalState;
//
//   const custombutton = chart.renderer.button('Return to US Map', 800, 10, () => {
//
//   }, null, null, pressedState).add();
// }

export default withRouter(StateMap);