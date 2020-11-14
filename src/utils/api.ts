import axios, { AxiosRequestConfig, Method } from 'axios';

export type PlainObject = Record<string, string>;

export const getResponse = async (
  url: string,
  method: Method,
  params?: PlainObject,
  data?: PlainObject,
  headers?: PlainObject,
) => {
  const config: AxiosRequestConfig = {
    data,
    headers,
    method,
    params,
    timeout: 30 * 1000,
    url,
    validateStatus: () => true, // accept any status code
  };

  const result = await axios(config);
  return { statusCode: result.status, data: result.data };
};
