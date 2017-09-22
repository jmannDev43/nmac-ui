import React from 'react';
import { shallow } from 'enzyme';
import YearStepper from '../YearStepper';

describe('<YearStepper />', () => {
  it('renders with default props', () => {
    const stepper = shallow(<YearStepper activeYear={2017} />);
    console.log('stepper', stepper.instance());
    expect(stepper).toHaveLength(1);
  });
});

