import chai = require('chai');
import api from './api';

jest.mock('../common');
jest.mock('../utils/api');

chai.use(api);

describe('api', () => {
  describe('response', () => {
    const url = 'url';
    const method = 'POST';
    const params = { param1: 'param1' };
    const data = { data1: 'data1' };
    const headers = { header1: 'header1' };

    const props = { url, method, params, data, headers };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on getResponse error', async () => {
      const { verifyProps } = require('../common');
      const { getResponse } = require('../utils/api');

      const error = new Error('Unknown error');
      getResponse.mockReturnValue(Promise.reject(error));

      const expected = { statusCode: 200, data: { id: 'id' } };

      expect.assertions(5);

      let received = null;
      try {
        await chai.expect(props).to.have.response(expected);
      } catch (e) {
        received = e;
      }

      expect(error).toBe(received);

      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props }, ['url', 'method']);

      expect(getResponse).toHaveBeenCalledTimes(1);
      expect(getResponse).toHaveBeenCalledWith(
        url,
        method,
        params,
        data,
        headers,
      );
    });

    test('should pass on have response', async () => {
      const { getResponse } = require('../utils/api');

      const actual = { statusCode: 200, data: { id: 'id' } };
      getResponse.mockReturnValue(Promise.resolve(actual));

      const expected = { statusCode: 200, data: { id: 'id' } };

      expect.assertions(1);

      // should not throw error on same response
      await chai.expect(props).to.have.response(expected);

      try {
        // should throw error on different response
        getResponse.mockReturnValue(Promise.resolve({ statusCode: 404 }));
        await chai.expect(props).to.have.response(expected);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
      }
    });

    test('should pass on not have response', async () => {
      const { getResponse } = require('../utils/api');

      const actual = { statusCode: 404, data: {} };
      getResponse.mockReturnValue(Promise.resolve(actual));

      const expected = { statusCode: 200, data: { id: 'id' } };

      expect.assertions(1);

      // should not throw error on different response
      await chai.expect(props).not.to.have.response(expected);
      try {
        // should throw error on same response
        await chai.expect(props).not.to.have.response(actual);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
      }
    });
  });
});
