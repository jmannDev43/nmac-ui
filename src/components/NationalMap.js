import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import StateMap from './StateMap';
import getMethods from '../getEventData';
import YearStepper from './YearStepper';
import mapData from '../third-party/us-all';

const Highcharts = require('highcharts/highmaps');

Highcharts.maps['countries/us/us-all'] = mapData;

function renderMap(eventData, props) {
  const max = Math.max.apply(null, eventData.map(d => d.value));
  Highcharts.mapChart('nationalMap', {
    chart: {
      borderWidth: 0,
      backgroundColor: '',
      map: 'countries/us/us-all',
    },
    title: {
      text: '',
    },
    legend: {
      enabled: true,
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom',
      },
    },
    colorAxis: {
      min: 1,
      max,
      type: 'logarithmic',
    },
    plotOptions: {
      series: {
        events: {
          click(e) {
            const url = props.match.url.replace('US', e.point.localState);
            props.history.push(url);
          },
        },
      },
      map: {
        states: {
          hover: {
            color: '#ff4852',
          },
        },
      },
    },
    series: [
      {
        name: 'States',
        mapData,
        color: '#E0E0E0',
      },
      {
        name: 'NMACs by Location',
        states: {
          hover: {
            color: '#ffc444',
          },
          select: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: true,
          format: '{point.localState} - {point.value}',
        },
        tooltip: {
          pointFormat: '{point.localState}, {point.value} collisions',
        },
        data: eventData,
        mapData,
        joinBy: ['hc-a2', 'localState'],
      },
    ],
  });
}

class NationalMap extends Component {
  constructor() {
    super();
    this.state = {
      eventData: null,
    };
  }
  componentDidMount() {
    this.getMapData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location !== this.props.location) {
      this.getMapData();
    }
  }
  getMapData() {
    const activeYear = parseInt(this.props.match.params.year, 10);
    getMethods.getEventCountsByYear(activeYear)
      .then(data => this.updateEventData(data));
  }
  updateEventData(eventData) {
    this.setState({ eventData });
    renderMap(eventData, this.props);
  }
  render() {
    const activeYear = this.props.match.params.year;
    if (!this.state.eventData) {
      return (<div style={{ height: (window.innerHeight - 30), textAlign: 'center' }}>
        <CircularProgress size={300} thickness={7} style={{ marginTop: '18em' }} />
      </div>);
    }
    return (
      <div>
        <Route path={'events/:state/:year'} component={StateMap} />
        <div id="nationalMap" />
        <YearStepper
          activeYear={activeYear}
          url={this.props.match.url}
        />
      </div>
    );
  }
}

export default withRouter(NationalMap);
