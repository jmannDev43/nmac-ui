import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { grey, red } from 'material-ui/colors';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { MenuItem } from 'material-ui/Menu';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import NationalMap from './NationalMap';
import StateMap from './StateMap';

const muiTheme = createMuiTheme({
  fontFamily: 'Roboto Slab, sans-serif',
  palette: {
    textColor: grey[900],
    primary1Color: red[700],
    accent1Color: grey[200],
    borderColor: grey[200],
    shadowColor: red[700],
  },
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      drawerOpen: false,
      navTitle: '',
    };
  }
  toggleDrawer() {
    const drawerOpen = !this.state.drawerOpen;
    this.setState({ drawerOpen });
  }
  updateNavTitle(appendToTitle) {
    const navTitle = `Near Mid Air Collisions (NMACs) - ${appendToTitle}`;
    this.setState({ navTitle });
  }
  render() {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className="App">
          <AppBar title={this.state.navTitle} />
          <Drawer open={this.state.drawerOpen}>
            <MenuItem primaryText="Close" onClick={this.toggleDrawer.bind(this)} />
          </Drawer>
          <div className="container-full">
            <Switch>
              <Route path="/events/national/:year" render={() => <NationalMap updateTitle={this.updateNavTitle.bind(this)} />} />
              <Route path="/events/state/:year/:country/:state" render={() => <StateMap updateTitle={this.updateNavTitle.bind(this)} />} />
              <Redirect from="/" to="/events/national/2017" />
            </Switch>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(App);
