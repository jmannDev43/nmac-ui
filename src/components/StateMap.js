import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import properCase from 'proper-case';
import { withRouter } from 'react-router-dom';
import eventMethods from '../api/getEventData';
import TimeLine from './TimeLine';
import DetailModal from './DetailModal';
import mapMethods from '../api/loadStateMapData';

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
        cursor: 'pointer',
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
      mapMethods.loadStateMapData(Highcharts, country, state, this.getEventsAndRender.bind(this));
    } else {
      this.getEventsAndRender();
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.getEventsAndRender();
    }
  }
  getEventsAndRender() {
    const activeYear = parseInt(this.props.match.params.year, 10);
    const state = this.props.match.params.state;
    const country = this.props.match.params.country;
    this.props.updateTitle(`${state}, ${country} (${activeYear})`);
    const mapKey = mapMethods.getMapKey(country, state);
    if (Highcharts.maps[mapKey]) {
      let stateGeoData = Highcharts.geojson(Highcharts.maps[mapKey]);
      stateGeoData = stateGeoData.filter(m => !m['hc-key']);
      eventMethods.getEventCountsByYearCountryAndState(activeYear, country, state)
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
    eventMethods.getEventsByYearStateCity(year, state, city.toUpperCase())
      .then(data => this.updateModalData(city, data));
  }
  render() {
    const activeYear = this.props.match.params.year;
    if (!this.state.eventData) {
      return (<div className="loaderWrapper" style={{ height: (window.innerHeight - 30), textAlign: 'center' }}>
        <CircularProgress size={300} style={{ marginTop: '18em' }} />
      </div>);
    }
    const modalTitle = this.state.selectedCity ?
      `Near Mid Air Collisions in ${properCase(this.state.selectedCity)}, ${this.props.match.params.state} (${activeYear})` : '';
    return (
      <div>
        <Button
          raised
          onClick={this.loadNationalMap.bind(this)}
          style={{ position: 'absolute', top: '105px', right: '9px', zIndex: 999 }}
        >
          Return to US
        </Button>
        <div id="stateMap" />
        <TimeLine activeYear={activeYear} />
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
