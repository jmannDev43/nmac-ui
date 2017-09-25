import mapMethods from '../loadStateMapData';

jest.mock('simple-load-script');
const loadScript = require('simple-load-script');

let Highcharts;

describe('loadStateMapData.js', () => {
  describe('getMapKey()', () => {
    it('Returns correct key for US state, regardless of case', () => {
      const mapKey1 = mapMethods.getMapKey('US', 'TX');
      const mapKey2 = mapMethods.getMapKey('us', 'tx');
      expect(mapKey1).toEqual('countries/us/us-tx-all');
      expect(mapKey2).toEqual('countries/us/us-tx-all');
    });
    it('Returns correct key for US territory, regardless of case', () => {
      const mapKey1 = mapMethods.getMapKey('VI', 'ST');
      const mapKey2 = mapMethods.getMapKey('pr', 'pr');
      expect(mapKey1).toEqual('countries/vi/vi-all');
      expect(mapKey2).toEqual('countries/pr/pr-all');
    });
  });
  describe('loadStateMapData()', () => {
    beforeEach(() => {
      Highcharts = {
        maps: {},
      };
    });
    it('Returns { isLoaded: false } when data key NOT found in maps array', () => {
      loadScript.mockImplementationOnce(srcUrl =>
        Promise.resolve({ isLoaded: false }));
      mapMethods.loadStateMapData(Highcharts, 'US', 'CA', (response) => {
        expect(Object.keys(Highcharts.maps).length).toEqual(0);
        expect(response.isLoaded).toEqual(false);
      });
    });
    it('Returns { error } when load returns error', () => {
      const error = new Error('test error');
      loadScript.mockImplementationOnce(srcUrl => Promise.reject(error));
      mapMethods.loadStateMapData(Highcharts, 'US', 'CA', (response) => {
        expect(Object.keys(Highcharts.maps).length).toEqual(0);
        expect(response.error).toEqual(error);
      });
    });
    it('Returns { isLoaded: true } when data already exists', () => {
      Highcharts.maps['countries/us/us-ca-all'] = {};
      loadScript.mockImplementationOnce(srcUrl => Promise.resolve());
      mapMethods.loadStateMapData(Highcharts, 'US', 'CA', (response) => {
        expect(Object.keys(Highcharts.maps).length).toEqual(1);
        expect(response.isLoaded).toEqual(true);
      });
    });
    it('Returns { isLoaded: true } after data is ADDED to key IS found in maps array', () => {
      loadScript.mockImplementationOnce(srcUrl => {
        Highcharts.maps['countries/us/us-ca-all'] = {};
        Promise.resolve({ isLoaded: false });
      });
      mapMethods.loadStateMapData(Highcharts, 'US', 'CA', (response) => {
        expect(Object.keys(Highcharts.maps).length).toEqual(0);
        expect(response.isLoaded).toEqual(false);
      });
    });
  });
});
