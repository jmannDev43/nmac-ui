import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import getMethods from '../getCollisionData';
import CircularProgress from 'material-ui/CircularProgress';
import YearStepper from './YearStepper';
import load from '@segment/load-script';
import DetailModal from './DetailModal';
import properCase from 'proper-case';
const Highcharts = require('highcharts/highmaps')
require('highcharts/modules/exporting')(Highcharts);

class StateMap extends Component {
  constructor() {
    super();
    this.state = {
      collisionData: null,
      isModalOpen: false,
      selectedCity: null,
      modalEventData: null,
    }
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
    const state = this.props.match.params.state;
    getMethods.getEventCountsByYearAndState(activeYear, state, this.updateCollisionData.bind(this));
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
        renderMap(collisionData, stateGeoData, mapKey, this.loadNationalMap.bind(this), this.loadDetailModal.bind(this));
      });
    }
  }
  loadNationalMap() {
    const activeYear = this.props.match.params.year;
    this.props.history.push(`/events/US/${activeYear}`)
  }
  handleModalClose() {
    this.setState({ isModalOpen: false });
  }
  updateModalData(city, cityEventData) {
    this.setState({
      isModalOpen: true,
      selectedCity: city,
      modalEventData: cityEventData
    });
  }
  loadDetailModal(point) {
    const year = point.year;
    const state = point.localState;
    const city = point.localCity;
    getMethods.getEventsByYearStateCity(year, state, city.toUpperCase(), this.updateModalData.bind(this));
  }
  render() {
    const activeYear = this.props.match.params.year;
    if (!this.state.collisionData) {
      return <div style={{height: (window.innerHeight - 30), textAlign: 'center'}}>
        <CircularProgress size={300} thickness={7} style={{marginTop: '18em'}}/>
      </div>
    }
    const modalTitle = this.state.selectedCity ?
      `Near Mid Air Collisions in ${properCase(this.state.selectedCity)}, ${this.props.match.params.state} (${activeYear})` : '';
    return (
      <div>
        <div id="stateMap"></div>
        <YearStepper
          activeYear={activeYear}
          url={this.props.match.url}
        />
        <DetailModal
          title={modalTitle}
          handleClose={this.handleModalClose.bind(this)}
          selectedCity={this.state.selectedCity}
          modalEventData={this.state.modalEventData}
          open={this.state.isModalOpen}
        />
      </div>
    )
  }
}

function renderMap(collisionData, stateGeoData, mapKey, loadNationalMap, loadDetailModal) {
  const state = collisionData[0].localState;
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
        onclick: loadNationalMap,
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
      series: {
        events: {
          click: function (e) {
            loadDetailModal(e.point);
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
        name: 'Cities',
        mapData: stateGeoData,
        color: '#E0E0E0'
      },
      {
        type: 'mapbubble',
        name: `${state} Near Mid Air Collisions`,
        data: collisionData,
        minSize: 4,
        maxSize: '12%',
        dataLabels: {
          enabled: true,
          format: '{point.z}'
        },
        tooltip: {
          pointFormat: '{point.localCity} - {point.z} collisions'
        }
      }
    ]
  });
}

export default withRouter(StateMap);