import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import StateMap from './StateMap';
import getMethods from '../getCollisionData';
import CircularProgress from 'material-ui/CircularProgress';
import YearStepper from './YearStepper';
import mapData from '../third-party/us-all'
const Highcharts = require('highcharts/highmaps')
Highcharts.maps['countries/us/us-all'] = mapData;

class NationalMap extends Component {
  constructor() {
    super();
    this.state = {
      collisionData: null
    }
  }
  getMapData() {
    const activeYear = parseInt(this.props.match.params.year, 10);
    getMethods.getEventCountsByYear(activeYear, this.updateCollisionData.bind(this));
  }
  componentDidMount() {
    this.getMapData();
  }
  updateCollisionData(collisionData) {
    this.setState({ collisionData });
    renderMap(collisionData, this.props);
  }
  componentDidUpdate(prevProps, prevState) {
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
        <Route path={`events/:state/:year`} component={StateMap}/>
        <div id="nationalMap"></div>
        <YearStepper
          activeYear={activeYear}
          url={this.props.match.url}
        />
      </div>
    )
  }
}

function renderMap(collisionData, props) {
  const max = Math.max.apply(null, collisionData.map((d) => d.value));
  Highcharts.mapChart('nationalMap', {
    chart: {
      borderWidth: 0,
      backgroundColor: '',
      map: 'countries/us/us-all',
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
      series: {
        events: {
          click: function (e) {
            // console.log('props', props);
            // console.log('e', e);
            const url = props.match.url.replace('US', e.point.localState);
            props.history.push(url);
            // drillDownMap(e, this.chart, props);
          }
        }
      },
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
        name: 'States',
        mapData,
        color: '#E0E0E0'
      },
      {
        name: 'NMACs by Location',
        states: {
          hover: {
            color: '#ffc444',
          },
          select: {
            enabled: true
          }
        },
        dataLabels: {
          enabled: true,
          format: '{point.localState} - {point.value}'
        },
        tooltip: {
          pointFormat: '{point.localState}, {point.value} collisions'
        },
        data: collisionData,
        mapData,
        joinBy: ['hc-a2', 'localState']
      }
    ]
  });
}

export default withRouter(NationalMap);