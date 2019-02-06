import axios from 'axios';

export interface IPlainObject {
  [key: string]: string;
}

export const getResponse = async (
  url: string,
  method: string,
  params?: IPlainObject,
  data?: IPlainObject,
  headers?: IPlainObject,
) => {
  const result = await axios({
    data,
    headers,
    method,
    params,
    timeout: 30 * 1000,
    url,
    validateStatus: () => true, // accept any status code
  });
  return { statusCode: result.status, data: result.data };
};
