import React, { Component } from 'react';
import NmacMap from './components/NmacMap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { orange50 as accent, red700 as primary, black } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';

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
      activeYear: 2016,
      activeState: null,
    }
  }
  updateMapData(mapData) {
    this.setState({ mapData });
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <AppBar title="Near Mid Air Collisons (NMACS)"/>
          <div className="container-full">
            <NmacMap
              mapData={this.state.mapData}
              updateMapData={this.updateMapData.bind(this)}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
