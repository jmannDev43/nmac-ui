import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

describe('<App />', () => {
  it('renders without crashing', () => {
    const appComponent = shallow(<App />);
    expect(appComponent).toHaveLength(1);
  });
});
