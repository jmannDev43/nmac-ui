import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { grey200 as accent, red700 as primary, black } from 'material-ui/styles/colors';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import NationalMap from './NationalMap';
import StateMap from './StateMap';

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
    super();
    this.state = {
      drawerOpen: false,
    };
  }
  toggleDrawer() {
    const drawerOpen = !this.state.drawerOpen;
    this.setState({ drawerOpen });
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <AppBar title={'Near Mid Air Collisons (NMACS)'} onLeftIconButtonTouchTap={this.toggleDrawer.bind(this)} />
          <Drawer open={this.state.drawerOpen}>
            <MenuItem primaryText="Close" onClick={this.toggleDrawer.bind(this)} />
          </Drawer>
          <div className="container-full">
            <Switch>
              <Route path="/events/national/:year" component={NationalMap} />
              <Route path="/events/state/:year/:country/:state" component={StateMap} />
              <Redirect from="/" to="/events/national/2017" />
            </Switch>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(App);
