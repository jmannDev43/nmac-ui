import eventMethods from '../getEventData';

let mockResponseData = [
  { id: 5058, eventYear: 2017, localCountry: 'US', localCity: 'CHANDLER', localState: 'AZ', latitude: 33.30616, longitude: -111.84125, eventCount: 2 },
  { id: 5059, eventYear: 2017, localCountry: 'US', localCity: 'PRESCOTT', localState: 'AZ', latitude: 34.540024, longitude: -112.468506, eventCount: 5 },
  { id: 5060, eventYear: 2017, localCountry: 'US', localCity: 'PALM BEACH', localState: 'FL', latitude: 26.70562, longitude: -80.03643, eventCount: 3 },
  { id: 5061, eventYear: 2017, localCountry: 'US', localCity: 'LAKELAND', localState: 'FL', latitude: 28.039465, longitude: -81.94981, eventCount: 6 },
];

describe('getEventData.js', () => {
  describe('getHascCode', () => {
    it('return valid non-PR code', () => {
      const hascCode = eventMethods.getHascCode('CA', 'US');
      expect(hascCode).toEqual('US.CA');
    });
    it('return valid PR code', () => {
      const hascCode = eventMethods.getHascCode('PR', 'US');
      expect(hascCode).toEqual('PR.');
    });
  });
  describe('getEvent methods', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.indexOf('eventCounts') > -1 && url.indexOf('state') > -1) {
          // return filtered data (single state), to mimic actual results
          mockResponseData = mockResponseData.filter(d => d.localState === 'FL');
        }
        const response = {
          json: () => mockResponseData,
        };
        return new Promise((resolve) => {
          resolve(response);
        });
      });
    });
    describe('getEventsByYearStateCity', () => {
      it('returns raw data, for modal', () => {
        eventMethods.getEventsByYearStateCity()
          .then(data => {
            expect(data.length).toEqual(4);
          });
      });
    });
    describe('getEventCountsByYear', () => {
      it('returns aggregate state data, in format for choropleth map', () => {
        eventMethods.getEventCountsByYear()
          .then(data => {
            expect(data.length).toEqual(2);
            expect(data[0].hascCode).toEqual('US.AZ');
            expect(data[0].value).toEqual(7);
            expect(data[1].hascCode).toEqual('US.FL');
            expect(data[1].value).toEqual(9);
            expect(data[0].year).toEqual(2017);
            expect(data[1].year).toEqual(2017);
          });
      });
    });
    describe('getEventCountsByYearCountryAndState', () => {
      it('returns aggregate state data, in format for mapbubble map', () => {
        eventMethods.getEventCountsByYearCountryAndState()
          .then(data => {
            expect(data.length).toEqual(2);
            expect(data[0].hascCode).toEqual('US.FL');
            expect(data[0].z).toEqual(3);
            expect(data[0].localCity).toEqual('Palm Beach');
            expect(data[0].year).toEqual(2017);
            expect(data[1].hascCode).toEqual('US.FL');
            expect(data[1].z).toEqual(6);
            expect(data[1].localCity).toEqual('Lakeland');
            expect(data[1].year).toEqual(2017);
          });
      });
    });
  });
});
