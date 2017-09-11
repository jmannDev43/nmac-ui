import React, { Component } from 'react';
import NmacMap from './components/NmacMap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { orange50 as accent, red700 as primary, black } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import YearStepper from './components/YearStepper';
import CircularProgress from 'material-ui/CircularProgress';
import getMethods from './getCollisionData';

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto Slab, sans-serif',
  palette: {
    textColor: black,
    primary1Color: primary,
    accent1Color: accent,
    borderColor: accent,
    shadowColor: primary,
  },
});

class App extends Component {
  constructor() {
    super()
    this.state = {
      mapData: null,
      activeYear: 2017,
      activeState: null,
    }
  }
  componentDidMount() {
    const eventByType = 'year';
    // intent is to update this so it's pulled from router
    const restParam = this.state.activeYear;
    getMethods.getEventCountsByYear(restParam, this.updateMapData.bind(this));
  }
  updateMapData(mapData) {
    this.setState({ mapData });
  }
  updateActiveYear(activeYear) {
    this.setState({ activeYear });
    getMethods.getEventCountsByYear(activeYear, this.updateMapData.bind(this));
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <AppBar title={`Near Mid Air Collisons (NMACS) - ${this.state.activeYear}`}/>
          <div className="container-full">
            { this.state.mapData ?
              <div>
                <NmacMap
                  activeYear={this.state.activeYear}
                  activeState={this.state.activeState}
                  mapData={this.state.mapData}
                  updateMapData={this.updateMapData.bind(this)}
                />
                { !this.state.activeState ?
                  <YearStepper
                    updateActiveYear={this.updateActiveYear.bind(this)}
                    activeYear={this.state.activeYear}
                    updateMapData={this.updateMapData.bind(this)}
                  /> :
                  null
                }
              </div>
              :
              <div style={{height: (window.innerHeight - 30), textAlign: 'center'}}>
                <CircularProgress size={300} thickness={7} style={{marginTop: '18em'}}/>
              </div>
            }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
