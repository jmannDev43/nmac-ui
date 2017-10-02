import React from 'react';
import { createMount } from 'material-ui/test-utils';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MockRouter from 'react-mock-router';
import NationalMap from '../NationalMap';
import eventMethods from '../../api/getEventData';

const Highcharts = require('highcharts/highmaps');

describe('<NationalMap />', () => {
  let mount;
  const theme = createMuiTheme();
  const updateTitle = (title) => { console.log('title', title); };
  const params = {
    year: '2017',
  };

  beforeEach(() => {
    mount = createMount();
    Highcharts.mapChart = jest.fn().mockImplementation((elemId, options) => {
      document.getElementById('nationalMap').textContent = JSON.stringify(options.series[1].data);
    });
  });
  afterEach(() => {
    eventMethods.getEventCountsByYear.mockRestore();
    Highcharts.mapChart.mockRestore();
  });
  it('renders loader when there is no eventData', async () => {
    const response = Promise.resolve(null);
    eventMethods.getEventCountsByYear = jest.fn().mockImplementation(() => response);
    const wrapper = mount(
      <MockRouter params={params}>
        <MuiThemeProvider theme={theme}>
          <NationalMap updateTitle={updateTitle} />
        </MuiThemeProvider>
      </MockRouter>,
    );

    await response.then(() => {
      wrapper.update();
    });
    expect(wrapper.find('#nationalMap').length).toBe(0);
    expect(wrapper.find('.loaderWrapper').length).toBe(1);
  });
  it('renders national map when there is eventData', async () => {
    const mockData = [
      { localCountry: 'PR', localState: 'PR', hascCode: 'PR.', value: 4, year: 1991 },
      { localCountry: 'US', localState: 'AK', hascCode: 'US.AK', value: 6, year: 1991 },
      { localCountry: 'US', localState: 'AL', hascCode: 'US.AL', value: 5, year: 1991 },
      { localCountry: 'US', localState: 'AR', hascCode: 'US.AR', value: 1, year: 1991 },
    ];
    const response = Promise.resolve(mockData);
    eventMethods.getEventCountsByYear = jest.fn().mockImplementation(() => response);
    const wrapper = mount(
      <MockRouter params={params}>
        <MuiThemeProvider theme={theme}>
          <NationalMap updateTitle={updateTitle} />
        </MuiThemeProvider>
      </MockRouter>,
    );
    await response.then(() => {
      wrapper.update();
    });
    const nationalMap = wrapper.find('#nationalMap');
    expect(nationalMap.text()).toEqual(JSON.stringify(mockData));
  });
});
