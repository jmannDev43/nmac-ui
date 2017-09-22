import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import properCase from 'proper-case';
import { withRouter } from 'react-router-dom';
import getMethods from '../getEventData';
import YearStepper from './YearStepper';
import DetailModal from './DetailModal';
import mapMethods from '../loadStateMapData';

// Necessary for Highmaps to plot lat/long data...
window.proj4 = require('../third-party/proj4');
const Highcharts = require('highcharts/highmaps');
require('highcharts/modules/exporting')(Highcharts);

function renderMap(eventData, stateGeoData, mapKey, loadDetailModal) {
  const state = mapKey.split('-')[1].toUpperCase();
  Highcharts.mapChart('stateMap', {
    chart: {
      borderWidth: 0,
      backgroundColor: '',
      map: mapKey,
    },
    title: {
      text: '',
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: 'white',
      },
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom',
      },
    },
    plotOptions: {
      series: {
        events: {
          click(e) {
            loadDetailModal(e.point);
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
        name: 'Cities',
        mapData: stateGeoData,
        color: '#E0E0E0',
      },
      {
        type: 'mapbubble',
        name: `${state} Near Mid Air Collisions`,
        data: eventData,
        minSize: 4,
        maxSize: '12%',
        dataLabels: {
          enabled: true,
          format: '{point.z}',
        },
        tooltip: {
          pointFormat: '{point.localCity} - {point.z} near collisions',
        },
      },
    ],
  });
}

class StateMap extends Component {
  constructor() {
    super();
    this.state = {
      eventData: null,
      isModalOpen: false,
      selectedCity: null,
      modalEventData: null,
    };
  }
  componentDidMount() {
    const state = this.props.match.params.state;
    const country = this.props.match.params.country;
    const mapKey = mapMethods.getMapKey(country, state);
    if (!Highcharts.maps[mapKey]) {
      mapMethods.loadStateMapData(country, state, this.getMapData.bind(this));
    } else {
      this.getMapData();
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.getMapData();
    }
  }
  getMapData() {
    const activeYear = parseInt(this.props.match.params.year, 10);
    const state = this.props.match.params.state;
    const country = this.props.match.params.country;
    const mapKey = mapMethods.getMapKey(country, state);
    if (Highcharts.maps[mapKey]) {
      let stateGeoData = Highcharts.geojson(Highcharts.maps[mapKey]);
      stateGeoData = stateGeoData.filter(m => !m['hc-key']);
      getMethods.getEventCountsByYearCountryAndState(activeYear, country, state)
        .then((eventData) => {
          this.setState({ eventData });
          renderMap(eventData, stateGeoData, mapKey, this.loadDetailModal.bind(this));
        });
    }
  }
  loadNationalMap() {
    const activeYear = this.props.match.params.year;
    this.props.history.push(`/events/national/${activeYear}`);
  }
  closeDetailModal() {
    this.setState({ isModalOpen: false });
  }
  updateModalData(city, cityEventData) {
    this.setState({
      isModalOpen: true,
      selectedCity: city,
      modalEventData: cityEventData,
    });
  }
  loadDetailModal(point) {
    const year = point.year;
    const state = point.localState;
    const city = point.localCity;
    getMethods.getEventsByYearStateCity(year, state, city.toUpperCase())
      .then(data => this.updateModalData(city, data));
  }
  render() {
    const activeYear = this.props.match.params.year;
    if (!this.state.eventData) {
      return (<div style={{ height: (window.innerHeight - 30), textAlign: 'center' }}>
        <CircularProgress size={300} thickness={7} style={{ marginTop: '18em' }} />
      </div>);
    }
    const modalTitle = this.state.selectedCity ?
      `Near Mid Air Collisions in ${properCase(this.state.selectedCity)}, ${this.props.match.params.state} (${activeYear})` : '';
    return (
      <div>
        <RaisedButton
          label="Return to US"
          onClick={this.loadNationalMap.bind(this)}
          primary={false}
          style={{ position: 'absolute', top: '105px', right: '9px' }}
        />
        <div id="stateMap" />
        <YearStepper
          activeYear={activeYear}
          url={this.props.match.url}
        />
        <DetailModal
          title={modalTitle}
          handleClose={this.closeDetailModal.bind(this)}
          selectedCity={this.state.selectedCity}
          modalEventData={this.state.modalEventData}
          open={this.state.isModalOpen}
        />
      </div>
    );
  }
}

export default withRouter(StateMap);
