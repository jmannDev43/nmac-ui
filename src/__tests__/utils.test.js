import isMaxYear from '../utils';

const years = [2000, 2001, 2002, 2003, 2004, 2005];

describe('utils.js', () => {
  describe('isMaxYear', () => {
    it('returns true if max year', () => {
      const testResult = isMaxYear(years, 2005);
      expect(testResult).toEqual(true);
    });
    it('returns false if NOT max year', () => {
      const testResult = isMaxYear(years, 2001);
      expect(testResult).toEqual(false);
    });
  });
});