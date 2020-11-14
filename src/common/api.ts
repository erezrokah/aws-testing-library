import { Method } from 'axios';
import { PlainObject } from '../utils/api';

export interface IApiProps {
  method: Method;
  url: string;
  params?: PlainObject;
  data?: PlainObject;
  headers?: PlainObject;
}

export interface IExpectedResponse {
  statusCode: number;
  data: PlainObject;
}

export const expectedProps = ['url', 'method'];
