import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import YearStepper from '../YearStepper';

describe('<YearStepper />', () => {
  it('renders with default props', () => {
    const muiTheme = getMuiTheme({});
    const tree = renderer.create(<BrowserRouter>
      <MuiThemeProvider muiTheme={muiTheme}>
        <YearStepper activeYear="2017" />
      </MuiThemeProvider>
    </BrowserRouter>).toJSON();
    console.log('tree', tree);
    expect(tree).toMatchSnapshot();
  });
});

