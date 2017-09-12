import React, { Component } from 'react';
import NationalMap from './NationalMap';
import StateMap from './StateMap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { grey200 as accent, red700 as primary, black } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

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
      drawerOpen: false,
      // mapData: null,
      // activeYear: 2017,
      // activeState: null,
    }
  }
  toggleDrawer() {
    const drawerOpen = !this.state.drawerOpen;
    this.setState({ drawerOpen });
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          {/*<AppBar title={`Near Mid Air Collisons (NMACS) - ${this.state.activeYear}`}/>*/}
          <AppBar title={`Near Mid Air Collisons (NMACS)`} onLeftIconButtonTouchTap={this.toggleDrawer.bind(this)}/>
          <Drawer open={this.state.drawerOpen}>
            <MenuItem primaryText="Close" onClick={this.toggleDrawer.bind(this)}/>
          </Drawer>
          <div className="container-full">
            <Switch>
              <Route path="/events/US/:year" component={NationalMap} />
              <Route path="/events/:state/:year" component={StateMap} />
              <Redirect from="/" to="/events/US/2017"/>
            </Switch>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(App);
