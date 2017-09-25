import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import YearStepper from '../YearStepper';

describe('<YearStepper />', () => {
  it('renders with default props', () => {
    const component = shallow(<YearStepper activeYear="2017" />);
    expect(component).toHaveLength(1);
    expect(component.instance().props.activeYear).toEqual('2017');
    expect(component).toMatchSnapshot();

    // const muiTheme = getMuiTheme({});
    // const stepper = mount(<BrowserRouter>
    //   <MuiThemeProvider muiTheme={muiTheme}>
    //     <YearStepper activeYear="2017" />
    //   </MuiThemeProvider>
    // </BrowserRouter>);
    // console.log('stepper', stepper._renderedComponent);
  });
});

