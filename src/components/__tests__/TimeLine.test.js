import React from 'react';
import { createMount, createShallow } from 'material-ui/test-utils';
import MockRouter from 'react-mock-router';
import TimeLine from '../TimeLine';

describe('<TimeLine />', () => {
  let mount;
  let shallow;
  const params = {
    year: '1994',
  };
  beforeEach(() => {
    mount = createMount();
    shallow = createShallow();
  });
  it('renders with activeYear passed to it', () => {
    const wrapper = mount(
      <MockRouter params={params}>
        <TimeLine activeYear={params.year} />
      </MockRouter>,
    );
    const shallowWrapper = shallow(
      <MockRouter params={params}>
        <TimeLine activeYear={params.year} />
      </MockRouter>,
    );
    const activeYearElement = wrapper.find('.active');
    const activeYear = activeYearElement.node.children[1].textContent;
    expect(activeYear).toBe(params.year);
    expect(shallowWrapper).toMatchSnapshot();
  });
});
