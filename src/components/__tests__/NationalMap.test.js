import React from 'react';
import { createShallow, createMount } from 'material-ui/test-utils';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MockRouter from 'react-mock-router';
import NationalMap from '../NationalMap';
import eventMethods from '../../api/getEventData';

const Highcharts = require('highcharts/highmaps');

const mockData = [
  { localCountry: 'PR', localState: 'PR', hascCode: 'PR.', value: 4, year: 1991 },
  { localCountry: 'US', localState: 'AK', hascCode: 'US.AK', value: 6, year: 1991 },
  { localCountry: 'US', localState: 'AL', hascCode: 'US.AL', value: 5, year: 1991 },
  { localCountry: 'US', localState: 'AR', hascCode: 'US.AR', value: 1, year: 1991 },
];
const response = Promise.resolve(mockData);
const getEventCountsByYear = jest.fn().mockImplementation(() => {
  return response;
});
eventMethods.getEventCountsByYear = getEventCountsByYear;

const mapChart = jest.fn().mockImplementation((elemId, options) => {
  document.getElementById('nationalMap').textContent = JSON.stringify(options.series[1].data);
});
Highcharts.mapChart = mapChart;

describe('<NationalMap />', () => {
  let shallow;
  let mount;

  beforeEach(() => {
    shallow = createShallow();
    mount = createMount();
  });

  it('renders national map when there is eventData', async () => {
    const theme = createMuiTheme();
    const updateTitle = (title) => { console.log('title', title); };
    const params = {
      year: '2017',
    };
    const wrapper = mount(
      <MockRouter params={params}>
        <MuiThemeProvider theme={theme}>
          <NationalMap updateTitle={updateTitle} />
        </MuiThemeProvider>
      </MockRouter>,
    );
    await response.then(() => {
      expect(wrapper.find('#nationalMap').length).toBe(1);
      wrapper.update();
    });
    const nationalMap = wrapper.find('#nationalMap');
    expect(nationalMap.text()).toEqual(JSON.stringify(mockData));
  });
});
