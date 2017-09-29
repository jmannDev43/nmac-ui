import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import StateMap from './StateMap';
import eventMethods from '../api/getEventData';
import YearStepper from './YearStepper';
import mapMethods from '../api/loadStateMapData';

const Highcharts = require('highcharts/highmaps');

// This is only necessary, because Highcharts' mapData .js files add properties to the
// Highcharts.maps object and so expects Highcharts to be globally available
// immediately at the time it's loaded...
if (!window.Highcharts) {
  window.Highcharts = Highcharts;
}
// pre-load US (for performance) & CA data (in case offline, to show drilldown functionality)
require('../third-party/us-all-territories');
require('../third-party/us-ca-all');

function drillIntoState(component, e) {
  const country = e.point.properties.hasc.split('.')[0];
  // PR is inconsistent with the rest of the Highcharts US territory map data...
  const state = country === 'PR' ? 'PR' : e.point.properties.hasc.split('.')[1];
  mapMethods.loadStateMapData(Highcharts, country, state, (response) => {
    if (response.isLoaded) {
      const year = component.props.match.params.year;
      const url = `/events/state/${year}/${country}/${state}`;
      component.props.history.push(url);
    } else if (response.error) {
      component.setState({ showErrorModal: true });
    }
  });
}

function renderMap(that, eventData) {
  const max = Math.max.apply(null, eventData.map(d => d.value));
  Highcharts.mapChart('nationalMap', {
    chart: {
      borderWidth: 0,
      backgroundColor: '',
      map: 'countries/us/custom/us-all-territories',
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
          click: drillIntoState.bind(null, that),
        },
      },
      map: {
        states: {
          hover: {
            color: '#ff4852',
          },
        },
        point: {
          events: {
            mouseOver: function (e) {
              this.graphic.element.style.cursor = 'pointer';
            },
          },
        },
      },
    },
    series: [
      {
        name: 'States',
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
          formatter: function () {
            return this.point.value ? `${this.point.properties['hc-a2']}-${this.point.value}` : this.point.properties['hc-a2'];
          },
        },
        tooltip: {
          pointFormat: '{point.name}, {point.value} near collisions',
        },
        data: eventData,
        joinBy: ['hasc', 'hascCode'],
      },
      {
        name: 'Separators',
        type: 'mapline',
        data: Highcharts.geojson(Highcharts.maps['countries/us/custom/us-all-territories'], 'mapline'),
        color: 'grey',
        showInLegend: false,
        enableMouseTracking: false,
      },
    ],
  });
}

class NationalMap extends Component {
  constructor() {
    super();
    this.state = {
      eventData: null,
      showErrorModal: false,
    };
  }
  componentDidMount() {
    this.getEventsAndRender();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.getEventsAndRender();
    }
  }
  getEventsAndRender() {
    const activeYear = parseInt(this.props.match.params.year, 10);
    this.props.updateTitle(`US (${activeYear})`);
    eventMethods.getEventCountsByYear(activeYear)
      .then((eventData) => {
        this.setState({ eventData });
        renderMap(this, eventData);
      });
  }
  closeErrorModal() {
    this.setState({ showErrorModal: false });
  }
  render() {
    const activeYear = this.props.match.params.year;
    if (!this.state.eventData) {
      return (<div style={{ height: (window.innerHeight - 30), textAlign: 'center' }}>
        <CircularProgress size={300} thickness={7} style={{ marginTop: '18em' }} />
      </div>);
    }
    const actions = [
      <FlatButton
        label="Close"
        primary
        onClick={this.closeErrorModal.bind(this)}
      />,
    ];
    return (
      <div>
        <Route path={'events/:state/:year'} component={StateMap} />
        <div id="nationalMap" />
        <YearStepper
          activeYear={activeYear}
        />
        <Dialog
          title="Unable to retrieve map data"
          actions={actions}
          modal={false}
          open={this.state.showErrorModal}
          onRequestClose={this.closeErrorModal}
          paperProps={{ zDepth: 0 }}
        >
          Unable to retrieve map data for the selected state.
          This may be due to a poor internet connection.
          <br /><br />
          Please check your connection and try again.
          <br /><br />
          *Note: CA map data is available offline, for localhost demo purposes :)
        </Dialog>
      </div>
    );
  }
}

export default withRouter(NationalMap);
