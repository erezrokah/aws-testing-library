import { getResponse } from './api';

jest.mock('axios');

describe('api utils', () => {
  test('should call axios with relevant parameters', async () => {
    const axios = require('axios');

    const expected = { status: 500, data: { message: 'Hello World!' } };
    axios.mockReturnValue(Promise.resolve(expected));

    const url = 'url';
    const method = 'POST';
    const params = { param1: 'param1' };
    const data = { data1: 'data1' };
    const headers = { header1: 'header1' };

    const result = await getResponse(url, method, params, data, headers);

    expect(axios).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith({
      data,
      headers,
      method,
      params,
      timeout: 30 * 1000,
      url,
      validateStatus: expect.any(Function),
    });

    expect(result).toEqual({
      data: expected.data,
      statusCode: expected.status,
    });

    expect(axios.mock.calls[0][0].validateStatus()).toBe(true);
  });
});
